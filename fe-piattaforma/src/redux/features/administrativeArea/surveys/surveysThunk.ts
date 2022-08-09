import { Dispatch, Selector } from '@reduxjs/toolkit';
import API from '../../../../utils/apiHelper';
import {
  mapOptions,
  transformFiltersToQueryParams,
} from '../../../../utils/common';
import {
  FormHelper,
  FormI,
  newForm,
  newFormField,
} from '../../../../utils/formHelper';
// import { generateJsonFormSchema } from '../../../../utils/jsonFormHelper';
import { RegexpType } from '../../../../utils/validator';
import { RootState } from '../../../store';
import { hideLoader, showLoader } from '../../app/appSlice';
import { getUserHeaders } from '../../user/userThunk';
import {
  setEntityFilterOptions,
  setSurveysList,
  setSurveyDetail,
  setEntityPagination,
} from '../administrativeAreaSlice';
import {
  setSurveyInfoForm,
  setSurveyQuestion,
  setSurveySection,
  SurveyQuestionI,
  SurveySectionI,
  SurveySectionPayloadI,
  SurveySectionResponseI,
} from './surveysSlice';

export interface SurveyLightI {
  id: string;
  nome: string;
  tipo: string;
  stato: string;
  defaultSCD: boolean;
  defaultRFD: boolean;
  descrizione: string;
  dataUltimaModifica: string;
}

export interface SchemaPayloadI {
  type: string;
  properties: {
    [key: string]: any;
  };
  required: string[];
  default: string[];
}

// Changes in endpoints request and response may require changes in the actions below

const GetAllSurveysAction = { type: 'administrativeArea/getAllSurveys' };

export const GetAllSurveys =
  () => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      // I dispatch this action because it has been done in other file
      // in the same place but I think it's not too useful (it is not managed by reducer),
      dispatch({ ...GetAllSurveysAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters, pagination },
      } = select((state: RootState) => state);
      const queryParamFilters = transformFiltersToQueryParams(filters);
      const endpoint = `/questionarioTemplate/all${queryParamFilters}`;
      const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
        getUserHeaders();
      const body = {
        codiceFiscaleUtenteLoggato: codiceFiscale,
        codiceRuoloUtenteLoggato: codiceRuolo,
        idProgetto: idProgetto,
        idProgramma: idProgramma,
      };
      const res = await API.post(endpoint, body, {
        params: {
          currPage: Math.max(0, pagination.pageNumber - 1),
          pageSize: pagination.pageSize,
        },
      });
      if (res.data)
        dispatch(setSurveysList({ data: res.data.questionariTemplate }));
      dispatch(
        setEntityPagination({
          totalPages: res.data.numeroPagine,
          totalElements: res.data.numeroTotaleElementi,
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const GetFilterValuesSurveyAction = {
  type: 'administrativeArea/getFilterValuesSurvey',
};

export const GetFilterValuesSurvey =
  (dropdownType: 'tipo' | 'stato') =>
  async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetFilterValuesSurveyAction });
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        administrativeArea: { filters },
      } = select((state: RootState) => state);
      const { codiceFiscale, codiceRuolo, idProgramma } = getUserHeaders();
      const body = {
        cfUtente: codiceFiscale,
        codiceRuolo,
        filtroRequest: { ...filters },
        idProgramma,
      };
      const endpoint = `/questionario/${dropdownType}/dropdown`;
      const res = await API.post(endpoint, body);
      if (res.data)
        dispatch(
          setEntityFilterOptions({
            [dropdownType]: mapOptions(res.data.data.list),
          })
        );
    } catch (error) {
      console.log('GetFilterValuesAction error');
    } finally {
      dispatch(hideLoader());
    }
  };

const GetSurveyDetailAction = { type: 'administrativeArea/getSurveyDetail' };

export const GetSurveyDetail =
  (idSurvey: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetSurveyDetailAction });
      const res = await API.get(`questionari/${idSurvey}`);
      if (res.data) dispatch(setSurveyDetail(res.data));
    } catch (error) {
      console.log('GetSurveyDetail error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

export const getTypeQuestionFirstSection = (id: string) => {
  switch (id) {
    case 'Nome':
    case 'Nazionalità':
    case 'Email':
    case 'Cognome':
    case 'Codice Fiscale':
    case 'Titolo di studio':
    case 'N Documento':
    case 'Occupazione':
      return 'text';
    case "Fascia d'età":
    case 'Telefono':
      return 'number';
    case 'Consenso al trattamento dati':
      return 'multiple';
    default:
      return '';
  }
};

export const newQuestion = (
  {
    id = new Date().getTime().toString(),
    form,
    name,
    type,
    isDefault,
    values,
  }: SurveyQuestionI = {
    id: new Date().getTime().toString(),
  }
) => ({
  id,
  form:
    form ||
    newForm([
      newFormField({
        field: 'question-description',
        required: true,
        value: name || '',
      }),
      newFormField({
        field: 'question-type',
        required: true,
        value: type || 'text',
      }),
      newFormField({
        field: 'question-values',
        value: values ? values : '',
      }),
      newFormField({
        field: 'question-required',
        value: isDefault || false,
      }),
      newFormField({
        field: 'question-default',
        value: isDefault || false,
        regex: RegexpType.BOOLEAN,
      }),
    ]),
});

export const newSection = (
  {
    id = new Date().getTime().toString(),
    questions = [],
    sectionTitle = 'Sezione',
    type = 'standard',
  }: SurveySectionI = {
    id: new Date().getTime().toString(),
    questions: [],
    sectionTitle: 'Sezione',
    type: 'standard',
  }
) => ({
  id,
  questions,
  sectionTitle,
  type,
});

const SetSurveySectionAction = { type: 'surveys/SetSurveySection' };
export const SetSurveySection =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      // console.log({ payload });
      // TODO manage update section
      dispatch({ ...SetSurveySectionAction, payload });
      dispatch(showLoader());
      dispatch(
        setSurveySection({
          section: newSection({
            sectionTitle: 'Sezione',
            questions: [newQuestion()],
          }),
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

const SetSurveyQuestionAction = {
  type: 'surveys/SetSurveyQuestionAction',
};
export const SetSurveyQuestion =
  (payload: { sectionId: string }) => async (dispatch: Dispatch) => {
    try {
      dispatch({ ...SetSurveyQuestionAction, payload });
      dispatch(showLoader());
      dispatch(
        setSurveyQuestion({
          question: newQuestion(),
          sectionID: payload.sectionId,
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

// const transformQuestionToFormField = (question: any, questionId: string) => {
//   return newFormField({
//     field: question['question-description'],
//     options: question['question-values']
//       ? JSON.parse(question['question-values'])
//       : undefined,
//     required: question['question-required'],
//     type: question['question-type'],
//     preset: question['question-default'],
//     id: questionId,
//   });
// };

const getSchemaTypeQuestion = (form: FormI) => {
  const properties: { [key: string]: any } = {};
  const valuesEnum: string[] = [];
  const valuesProperties: { [key: string]: { type: string } } = {};
  switch (form['question-type']?.value) {
    case 'number':
      properties.type = 'number';
      break;
    case 'time':
      properties.type = 'time';
      break;
    case 'date':
      properties.type = 'date';
      break;
    case 'range':
      properties.type = 'range';
      properties.minimum = 1;
      properties.maximum = 5;
      break;
    case 'select':
      properties.type = 'string';
      if (typeof form['question-values'].value === 'string') {
        // eslint-disable-next-line no-case-declarations
        const values: { label: string; value: string }[] = JSON.parse(
          form['question-values'].value
        );
        values.map((val) => valuesEnum.push(val.value));
        properties.enum = valuesEnum;
      }
      break;
    case 'checkbox':
      properties.type = 'object';
      if (typeof form['question-values'].value === 'string') {
        // eslint-disable-next-line no-case-declarations
        const values: { label: string; value: string }[] = JSON.parse(
          form['question-values'].value
        );
        values.map((val) => {
          valuesProperties[val.value] = { type: 'boolean' };
        });
        properties.properties = valuesProperties;
      }
      break;
    case 'text':
    default:
      properties.type = 'string';
      break;
  }
  return properties;
};

const getSchemaSection = (
  section: SurveySectionI,
  originalSchemaSection: string
) => {
  const originalSchemaSectionParsed = JSON.parse(originalSchemaSection);
  const schemaSection: SchemaPayloadI = {
    type: originalSchemaSectionParsed?.type,
    properties: {},
    required: [],
    default: [],
  };

  (section.questions || []).map((question, index) => {
    if (question?.id) {
      if (Number(question?.id) > 0 && Number(question?.id) < 35) {
        // default question
        const id = question.id;
        schemaSection.properties[id] = {
          ...originalSchemaSectionParsed.properties[id],
          title: question.form['question-description'].value,
        };
        schemaSection.required.push(id);
        schemaSection.default.push(id);
      } else {
        // new question
        const id = question.id;
        schemaSection.properties[id] = {
          id: id,
          title: question.form['question-description'].value,
          ...getSchemaTypeQuestion(question.form),
          order: index + 1,
        };
        if (question.form['question-required'].value === 'true')
          schemaSection.required.push(id);
      }
    }
  });
  return JSON.stringify(schemaSection);
};

export interface SurveyResponseBodyI {
  'survey-id'?: string;
  'survey-status'?: string;
  'default-RFD'?: boolean;
  'default-SCD'?: boolean;
  'last-update'?: string;
  'survey-name'?: string;
  'survey-description'?: string;
  'survey-sections'?: SurveySectionResponseI[];
}

export interface SurveyCreationBodyI {
  'survey-name'?: string;
  'survey-description'?: string;
  'survey-sections'?: SurveySectionPayloadI[];
}

const SetSurveyCreationAction = { type: 'surveys/SetSurveyCreation' };
export const SetSurveyCreation =
  (isClone: boolean) => async (dispatch: Dispatch, select: Selector) => {
    try {
      dispatch({ ...SetSurveyCreationAction, isClone });
      dispatch(showLoader());
      const {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        survey,
      } = select((state: RootState) => state);
      if (survey) {
        const body: SurveyCreationBodyI = {
          ...FormHelper.getFormValues(survey.form),
          'survey-sections': [],
        };
        survey.sections.forEach((section: SurveySectionI, index: number) => {
          const newSection = {
            id: survey?.sectionsSchemaResponse[index].id,
            title: survey?.sectionsSchemaResponse[index].title,
            'default-section':
              survey?.sectionsSchemaResponse[index]['default-section'],
            schema: '',
            schemaui: survey?.sectionsSchemaResponse[index].schemaui.json,
          };
          if (index < 2) {
            newSection.schema =
              survey?.sectionsSchemaResponse[index].schema.json;
          } else {
            newSection.schema = getSchemaSection(
              section,
              survey?.sectionsSchemaResponse[index].schema.json
            );
          }
          body['survey-sections']?.push(newSection);
        });
        let res;
        if (isClone) {
          res = await API.post(`questionarioTemplate`, body);
        } else {
          res = await API.put(`questionarioTemplate/${survey.surveyId}`, body);
        }
        return res;
      }
    } finally {
      dispatch(hideLoader());
    }
  };

const GetSurveyInfoAction = { type: 'surveys/GetSurveyInfo' };
export const GetSurveyInfo =
  (questionarioId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...GetSurveyInfoAction, questionarioId });
      const res = await API.get(`questionarioTemplate/${questionarioId}`);
      if (res?.data) {
        dispatch(setSurveyInfoForm(res.data));
      }
    } catch (e) {
      console.error('questionario detail GetSurveyInfo', e);
    } finally {
      dispatch(hideLoader());
    }
  };

const PostFormCompletedByCitizenAction = {
  type: 'surveys/PostFormCompletedByCitizen',
};
export const PostFormCompletedByCitizen =
  (payload?: any) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...PostFormCompletedByCitizenAction, payload });
      const entityEndpoint = `/`;
      const body = {
        payload,
      };
      const res = await API.post(entityEndpoint, body);
      if (res) {
        /* TODO: controllo se post andata a buon fine */
      }
    } catch (e) {
      console.error(
        'post questionario compilato PostFormCompletedByCitizen',
        e
      );
    } finally {
      dispatch(hideLoader());
    }
  };

// Thunk for updating exclusive field in Questionario entity

export const UpdateSurveyExclusiveField =
  (payload?: any) => async (dispatch: any) => {
    dispatch(showLoader());
    const { flagType, surveyId } = payload;
    try {
      const endpoint = `/questionarioTemplate/aggiornadefault/${surveyId}?tipoDefault=${flagType}`;
      await API.put(endpoint);
      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
    }
  };

const GetSurveyAllLightAction = {
  type: 'administrativeArea/GetSurveyAllLight',
};

export const GetSurveyAllLight = () => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    dispatch({ ...GetSurveyAllLightAction });
    const { codiceFiscale, codiceRuolo, idProgramma, idProgetto } =
      getUserHeaders();
    const body = {
      codiceFiscaleUtenteLoggato: codiceFiscale,
      codiceRuoloUtenteLoggato: codiceRuolo,
      idProgetto: idProgetto,
      idProgramma: idProgramma,
    };
    const res = await API.post(`questionarioTemplate/all/light`, body);
    if (res.data) dispatch(setSurveysList({ data: res.data }));
  } catch (error) {
    console.log('GetSurveyAllLight error', error);
  } finally {
    dispatch(hideLoader());
  }
};

const DeleteSurveyAction = {
  type: 'surveys/DeleteSurvey',
};

export const DeleteSurvey =
  (idQuestionario: string) => async (dispatch: Dispatch) => {
    try {
      dispatch(showLoader());
      dispatch({ ...DeleteSurveyAction, idQuestionario });
      const res = await API.delete(`/questionarioTemplate/${idQuestionario}`);
      if (res) {
        /* TODO: controllo se post andata a buon fine */
      }
    } catch (e) {
      console.error('UpdateSurveyDefault error', e);
    } finally {
      dispatch(hideLoader());
    }
  };
