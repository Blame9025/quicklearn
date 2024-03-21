import {useState,useEffect} from "react"
import { useTranslation } from 'react-i18next'
export function getLanguage() {
    var [language, setLanguage] = useState<string>(localStorage.getItem("language") || "ro");
    const { t, i18n } = useTranslation();
    useEffect(() => {
        i18n.changeLanguage(language)
        localStorage.setItem("language", language)
    }, [language])
    var languages: { [key: string]: string } = {
        ["ro"]: "Romanian",
        ["en"]: "English"
    };

    return { language, setLanguage, languages };
}
