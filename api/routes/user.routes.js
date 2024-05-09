const verifyToken  = require("../middleware/verifyJwt.js");
const path = require('path');
const { Request, Response } = require('express');
const multer = require('multer');
const uploadFilePath = path.resolve(__dirname, '../..', 'api/public/uploads');
const jwt = require("jsonwebtoken");
const db = require("../db.js");
const User = db.user;
var fs = require('fs');
const storageFile = multer.diskStorage({
  destination: uploadFilePath,
  filename(req, file, fn){
    fn(null, `${new Date().getTime().toString()}-${file.originalname}${path.extname(file.originalname)}`);
  },
});

const uploadFile = multer({
  storage: storageFile,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, callback) {
    const extension = ['.doc', '.docx', '.pdf', ".pptx"].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
    if (extension) {
      return callback(null, true);
    }
    
    callback(new Error('invalid file type'));
  },
}).single('file');


const handleSingleUploadFile = async (req, res) => {
  return new Promise((resolve, reject) => {
    uploadFile(req, res, (error) => {
      if (error) {
        reject(error);
      }
      
      resolve({ file: req.file, body: req.body });
    });
  });
};
const OpenAI = require("openai");
const openai = new OpenAI();

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/document/action/questions", [verifyToken], async (req, res) => {
    const tokenData = jwt.verify(req.headers["authorization"], process.env.JWT_SECRET);
    const user = await User.findOne({ _id: tokenData.id }).exec();
    console.log(req.body)
    const document = user.documents.find(document => document.id == req.body.id)
    if(!document)
      return res.send({ code: "document_not_found" });
    var backupQuestions = document.questions;
    for(var question of backupQuestions) {
      for(var answer of question.answers) {
        delete answer.correct;
      }
    }
    res.send({ code: "success", questions: backupQuestions });
  })
  app.post("/api/document/action/submit", [verifyToken], async (req, res) => {
    const tokenData = jwt.verify(req.headers["authorization"], process.env.JWT_SECRET);
    const user = await User.findOne({ _id: tokenData.id }).exec();
    const document = user.documents.find(document => document.id == req.body.id)
    if(!document)
      return res.send({ code: "document_not_found" });
    var score = 0;
    var maxScore = document.questions.length;
    console.log(req.body.responses,document.questions)
    for(let i = 0; i < document.questions.length; i++) {
      let correctAnswerIndex = document.questions[i].answers.findIndex(answer => answer.correct);
      console.log(req.body.responses,correctAnswerIndex)
      if(parseInt(req.body.responses[i]) == correctAnswerIndex) {
        score++;
      }
    }
    res.send({ code: "success", score: score, maxScore: maxScore })
  })
  app.post("/api/document/action/delete", [verifyToken], async (req, res) => {
    const tokenData = jwt.verify(req.headers["authorization"], process.env.JWT_SECRET);
    const user = await User.findOne({ _id: tokenData.id }).exec();
    const document = user.documents.find(document => document.id == req.body.id)
    if(!document)
      return res.send({ code: "document_not_found" });
    user.documents = user.documents.filter(document => document.id != req.body.id)
    user.save()
    const token = jwt.sign({   
      id: user._id,
      name: user.name,
      email: user.email,
      documents: user.documents, 
    },
    process.env.JWT_SECRET,
    {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
    });
    res.send({
      code: "success",
      token: token
    })
  })
  app.post("/api/document/action/verify", [verifyToken], async (req, res) => {
    const tokenData = jwt.verify(req.headers["authorization"], process.env.JWT_SECRET);
    const user = await User.findOne({ _id: tokenData.id }).exec();
    const document = user.documents.find(document => document.id == req.body.id)
    if(!document)
      return res.send({ code: "document_not_found" });
    let correctAnswerIndex = document.questions[req.body.question].answers.findIndex(answer => answer.correct);
    res.send({
      code: "success",
      correct: correctAnswerIndex
    })
  })
  async function requestGPT(res,req){
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content:
            "Please process the content of the document in "+req.body.language+" language. Create a set of at least 10 you have not maximum count of questions , please create questions for every row of content analyzed, of course questions based on the content that should help me understand the document better. With the questions should come 3 variant of responses, 1 correct, 2 wrong attached to every question. Please pass the question with answers in JSON format and do not use code formatter.An example you must follow is {'question': 'The current year is:' , 'answers': [{'answer': '2023',correct:false},{'answer': '2024',correct:true},{'answer': '2022',correct:false}]}, do not create a answer pattern. Please provide the questions in the language provided. The content should only contain the JSON as I explained to you."
        },
      ],
      tool_resources: { 
        "file_search": {
          "vector_store_ids": [process.env.OPENAI_VECTOR]
        }
      }
    });

    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT,
    });
     
    const messages = await openai.beta.threads.messages.list(thread.id, {
      run_id: run.id,
    });
    return messages
  }
  app.post("/api/document/action/upload", [verifyToken], async (req, res) => {
    uploadFile(req, res, async (error) => {
      if (error) {
        return res.send({ code: "file_not_uploaded" });
      }
      const tokenData = jwt.verify(req.headers["authorization"], process.env.JWT_SECRET);
      const user = await User.findOne({ _id: tokenData.id }).exec();
      console.log(user)
      const documentId = typeof user.documents == "object" ? Object.keys(user.documents).length+1 : user.documents.length + 1
      
      const newPath = req.file.destination+"\\" + tokenData.id+"-"+documentId + path.extname(req.file.originalname).toLowerCase()
      console.log(newPath)
      fs.renameSync(req.file.path, newPath)
      var fileStream
      try{
        console.log("newPath",newPath)
        fileStream = fs.createReadStream(newPath)
      }catch(e) {
        console.log("filestream error",e)
      }
      const file = await openai.files.create({
        file: fileStream,
        purpose: "assistants",
      });
      await openai.beta.vectorStores.files.create(
        process.env.OPENAI_VECTOR,
        {
          file_id: file.id
        }
      )
      const messages = await requestGPT(res,req)
       
      const message = messages.data.pop();
      if (message.content[0].type === "text") {
        const { text } = message.content[0];
        // await openai.files.del(file.id); 
        // await openai.beta.vectorStores.files.del(
        //   process.env.OPENAI_VECTOR,
        //   file.id
        // );

        // await fs.rmSync(newPath, { force: true })  
        // await openai.beta.threads.del(thread.id);

        var questions;
        try{
          console.log("before",JSON.parse(text.value))
          const parsedContent = JSON.parse(text.value)
          questions = parsedContent.questions ? parsedContent.questions : parsedContent
        }catch(e){
          
          console.log("[API] Error parsing JSON",e)
          return res.send({
            code: "wrong_format"
          })
          
        }
        function randomIntFromInterval(min, max) { // min and max included 
          return Math.floor(Math.random() * (max - min + 1) + min);
        }
        console.log(typeof questions, questions)
        for(let question of questions) {
          question.answers.sort(() => randomIntFromInterval(0,2));
        }
        user.documents.push({fileName: req.file.originalname, questions: questions ,id: documentId});
        
        var documentsBackup = JSON.parse(JSON.stringify(user.documents))
        for(document in documentsBackup)
          delete documentsBackup[document].questions
        console.log(documentsBackup)
        const token = jwt.sign({   
          id: user._id,
          name: user.name,
          email: user.email,
          documents: documentsBackup, 
        },
        process.env.JWT_SECRET,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 86400, // 24 hours
        });
       
        res.send({
          code: "file_uploaded", 
          token: token
        });
        user.save()
      }
    
    });
  });
};