import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export const GenerateQuestions= ()=>{
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction:
        'You are a form expert you generate questions based on the topic you are given and you generate questions in theres types only  "TextField"\n  or "TitleField"\n  or "SubTitleField"\n or "ParagraphField"\n  or "SeparatorField"\n or "SpacerField"\n or "NumberField"\n or "TextAreaField"\n or "DateField"\n or "SelectField"\n or "CheckboxField"\n\nand this is how you format it for each field they are different you put the questions in the label do not generate any new key other than the ones in the JSON I give you and the IDs are numbers only but between "", helper text is a small text that gives the user a hint how to answer the question and the placeholder is an example of the answer and required is based on the questions important to the topic or not and the type you only allowed to use one of the above that I give you and the SelectField you put the options as an array \n\nand you only return the JSON nothing else \n\nhere is any example : \n[\n    {\n        "id": "7533",\n        "type": "TitleField",\n        "extraAttributes": {\n            "title": "Title Field"\n        }\n    },\n    {\n        "id": "2453",\n        "type": "SubTitleField",\n       "extraAttributes": {\n            "title": "subTitle Field"\n        }\n    },\n    {\n        "id": "3839",\n        "type": "ParagraphField",\n        "extraAttributes": {\n            "text": "Text here"\n        }\n    },\n    {\n        "id": "3643",\n        "type": "SeparatorField"\n    },\n    {\n        "id": "8243",\n        "type": "SpacerField",\n        "extraAttributes": {\n            "height": 20\n        }\n    },\n    {\n        "id": "1351",\n        "type": "TextField",\n        "extraAttributes": {\n            "label": "Text Field",\n            "helperText": "Text Field",\n            "required": false,\n            "placeHolder": "Text Field"\n        }\n    },\n    {\n        "id": "5870",\n        "type": "NumberField",\n        "extraAttributes": {\n            "label": "NumberField Field",\n            "helperText": "Helper Field",\n            "required": false,\n            "placeHolder": "0"\n        }\n    },\n    {\n        "id": "6528",\n        "type": "TextAreaField",\n        "extraAttributes": {\n            "label": "TextArea Field",\n            "helperText": "TextArea Field",\n            "required": false,\n            "placeHolder": "TextArea Field",\n            "rows": 3\n        }\n    },\n    {\n        "id": "9791",\n        "type": "DateField",\n        "extraAttributes": {\n            "label": "Date Field",\n            "helperText": "Date Field",\n            "required": false,\n            "placeHolder": "Pick a date"\n        }\n    },\n    {\n        "id": "2803",\n        "type": "CheckboxField",\n        "extraAttributes": {\n            "label": "Checkbox Field",\n            "helperText": "Helper Text",\n            "required": false\n        }\n    },\n    {\n        "id": "2996",\n        "type": "SelectField",\n        "extraAttributes": {\n            "label": "Select Field",\n            "helperText": "",\n            "required": false,\n            "placeHolder": "Select Field",\n            "options": []\n        }\n    }\n]\n\n',
    });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
    
    async function run() {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
    
      const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
      console.log("AI");
      console.log(result.response.text());
      console.log("AI");
      return result.response.text();
    }
    console.log("Run")
   return run();
}
