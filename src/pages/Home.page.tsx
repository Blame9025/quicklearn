import {useState,useEffect} from 'react';
import { LoadingOverlay,Paper,Group,Radio,Stack,Center,Text,Button } from '@mantine/core';
import { Nav } from '../components/Nav/Nav';
import { DropzoneFullScreenComp } from '../components/DropzoneFullScreen/DropzoneFullScreen';
import axiosHandler from '../axios';
import { getLanguage } from '../components/Language/Language';
import {useTranslation} from 'react-i18next'
import classes from "./Home.module.css"
import { getTokenData } from '@/data';

export function HomePage() {
  const [loading,setLoading] = useState(false)
  const {languages, language, setLanguage} = getLanguage()
  const {t, i18n} = useTranslation();
  const [started, setStarted] = useState(false)
  const [filename, setfilename] = useState("")
  const [fileid, setfileid] = useState(-1)
  const [questions, setQuestions] = useState<any>()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [finished,setFinished] = useState(false)
  const [score,setScore] = useState("")
  const [value, setValue] = useState("");
  const data = getTokenData("token") as {documents: {id: number, fileName: string}[]} 
  const [time, setTime] = useState("")
  var endTime;
  var timePerQuestion = 1  // un minut per intrebare
  var timer: string | number | NodeJS.Timeout | undefined
  async function onFileClick(id: number,name: string){
    setfileid(id)
    setStarted(false)

    setfilename(name)
  }

  async function onQuizStart()
  {
    setStarted(true)
    const resp = await axiosHandler.post("/api/document/action/questions", {
      id: fileid
    })
    endTime = Date.now() + (timePerQuestion * 60 * 1000 * resp.data.questions.length)
    setQuestions(resp.data.questions)
    const newD = new Date(endTime)
    clearInterval(timer)
    timer = setInterval(() => {
      setTime(Date.now() - newD.getTime() > 0 ? "00:00" : new Date(newD.getTime() - Date.now()).toISOString().substr(14, 5))
    },1000)
  }

  async function nextQuestion()
  {
    if(value.trim() == ""){
      return
    }
    setValue("")
    var responses = JSON.parse(sessionStorage.getItem("responses") || "[]")
    responses[currentQuestion] = parseInt(value)
    sessionStorage.setItem("responses", JSON.stringify(responses))
    if(currentQuestion + 1 == questions.length)
    {
      clearInterval(timer)

      const resp = await axiosHandler.post("/api/document/action/submit", {
        id: fileid,
        responses: responses
      })
      console.log(resp)
      sessionStorage.removeItem("responses")
      setScore(resp.data.score+"/"+resp.data.maxScore)
      setFinished(true)
      setCurrentQuestion(0);
      return
    }
    console.log(responses)
    setCurrentQuestion(currentQuestion + 1)
  }
  async function dropFile(file: File){
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", languages[language]);
    
    setLoading(true)
    const resp = await axiosHandler.post("/api/document/action/upload", formData,{
      timeout: 60000,
    })
    if(resp.data.code == "file_uploaded")
    {
      sessionStorage.setItem("token", resp.data.token);
    }
    setLoading(false)
  }
  return (
    <>
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <DropzoneFullScreenComp dropFile={dropFile}/>
      <Nav onFileClick={onFileClick} />
      <Paper shadow="xs" pos="absolute" left={310} bottom={10} w={1600} h={910} bg="dark">
        <Center mah={910} maw={800} h ={910} ml={350}>
          {!started ? 
          <>
            {filename != "" ? 
              <Stack>
                <Text fz="h1">{filename}</Text>
                <Button variant='primary' onClick={() => {
                  onQuizStart()
                }}>{t("home_quiz_start")}</Button>
              </Stack> : 
            <Text fz="h1">{data?.documents.length > 0 ? t("home_quiz_selectfile") : t("home_quiz_uploadfile") }</Text>
            }
          </>
          :
          <>
            {
              finished ? 
              <>
                <Stack justify='center' ta="center">
                  <Text fz="h1">{t("home_quiz_finished")}</Text>
                  <Text fz="h2">{t("home_quiz_score")}: {score}</Text>
                </Stack>
              </>
              :
              <>
                <Radio.Group
                  flex={1}
                  value={value}
                  onChange={setValue}
                  classNames={{label: classes.titleLabel}}
                  label={questions ? questions[currentQuestion].question: ""}
                >
                  <Stack mt={10} justify='center' >
                    <Paper shadow="xs" p = "md" withBorder onClick={() => {
                      setValue("0")
                    }}>
                      <Radio classNames={{label: classes.radioLabel}} value="0" label={questions ?  questions[currentQuestion].answers[0].answer : ""} />
                    </Paper>
                    <Paper shadow="xs" p = "md" withBorder onClick={() => {
                      setValue("1")
                    }}>
                      <Radio classNames={{label: classes.radioLabel}} value="1" label={questions ?  questions[currentQuestion].answers[1].answer : ""} />
                    </Paper>
                    <Paper shadow="xs" p = "md" withBorder onClick={() => {
                      setValue("2")
                    }} >
                      <Radio classNames={{label: classes.radioLabel}} value="2" label={questions ?  questions[currentQuestion].answers[2].answer : ""} />
                    </Paper>
                  </Stack>
                </Radio.Group>
                <Text pos="absolute" top={850} left={50} className={classes.timer}>
                  {time}
                </Text>
                <Button pos="absolute" top={850} right={50} disabled={value == ""} onClick={nextQuestion} >Next question</Button>
              </>
            }
          </> 
          }
        </Center>
 
      </Paper>
    </>
  );
}
