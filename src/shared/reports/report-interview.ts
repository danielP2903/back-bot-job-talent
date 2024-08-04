import { ObjectId } from 'mongodb';
import {
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

const styles: StyleDictionary = {
  header: {
    fontSize: 18,
    bold: true,
    alignment: 'center',
    margin: [0, 60, 0, 20],
  },
  body: {
    alignment: 'justify',
    margin: [0, 0, 0, 30],
  },
  signature: {
    fontSize: 14,
    bold: true,
  },
  footer: {
    fontSize: 10,
    italics: true,
    alignment: 'center',
    margin: [0, 50, 0, 20],
  },
  columnTitle: {
    bold: true,
    fontSize: 16,
    margin: [0, 0, 0, 20],
  },
};
export interface IResultInterview {
  _id: ObjectId;
  idInterview: ObjectId;
  interview: { question: string; response: string }[];
  presenter: { email: string; names: string };
  qualification: string;
  feedback: string;
  user: { idRecruitment: string; email: string };
  vacancy: string;
  comments: string;
}
export const getReportInterviewPdf = (params: IResultInterview) => {
  const contentPDF = [];
  params.interview.forEach((value, index) => {
    contentPDF.push({
      text: `Pregunta ${index + 1}: ${value.question}`,
      style: 'body',
      bold: true,
    });
    contentPDF.push({
      text: `Respuesta: ${value.response}`,
      style: 'body',
    });
  });
  const logo: Content = {
    image: 'src/assets/bot.png',
    width: 100,
    height: 100,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  };
  const qualificationDefinition: Content = {
    text: `Calificación:`,
    style: 'columnTitle',
  };
  const dataQualificationDef: Content = {
    text: ` ${params.qualification.replace(',', '')}/100 puntos`,
    margin: [0, 0, 0, 20],
    color: 'green',
    bold: true,
  };
  const commentsDef: Content = {
    text: 'Comentarios:',
    style: 'columnTitle',
  };
  const commentsDataDef: Content = {
    text: ` ${params.comments.replace('.', '').replace(',', '')}`,
  };
  const docDefinition: TDocumentDefinitions = {
    content: [
      logo,
      {
        text: 'Bot Job Talent',
        fontSize: 25,
        bold: true,
        color: '#EAB308',
        alignment: 'center',
        margin: [0, -25, 0, 30],
      },
      {
        text: `Presentado por: ${params.presenter.names.toLocaleUpperCase()}`,
        margin: [0, 0, 0, 20],
        bold: true,
        fontSize: 14,
      },
      {
        text: `Cargo: ${params.vacancy}`,
        margin: [0, 0, 0, 20],
        bold: true,
        fontSize: 14,
      },
      {
        text: `Entrevista técnica`,
        style: 'header',
      },
      contentPDF,
      {
        text: `Resultados`,
        style: 'header',
        fontSize: 20,
      },
      {
        columns: [qualificationDefinition, dataQualificationDef],
      },
      {
        columns: [commentsDef, commentsDataDef],
      },
      {
        text: 'Generado por Bot Job Talent',
        style: 'footer',
      },
    ],
    styles: styles,
    pageMargins: [40, 60, 40, 60],
  };

  return docDefinition;
};
