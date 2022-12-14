const R = require('ramda');

const MSGS = {
  SHOW_FORM: 'SHOW_FORM',
  description_INPUT: 'description_INPUT',
  ANSWER_INPUT: 'ANSWER_INPUT',
  SAVE_CARD: 'SAVE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  ANSWER_SHOW: 'ANSWER_SHOW'
};

function showFormMsg(showForm) {
  return {
    type: MSGS.SHOW_FORM,
    showForm,
  };
}

function frontInputMsg(description) {
  return {
    type: MSGS.description_INPUT,
    description,
  };
}

function backInputMsg(back) {
  return {
    type: MSGS.ANSWER_INPUT,
    back,
  };
}

const saveCardMsg = { type: MSGS.SAVE_CARD };

function deleteCardMsg(id) {
  return {
    type: MSGS.DELETE_CARD,
    id,
  };
}

function showAnswer(id, showAnswer = "", changeTextStatus = 1, changeddescription = "", changedAnswer = "") {
  if (changedAnswer=== "") {
    return {
      type: MSGS.ANSWER_SHOW,
      id,
      showAnswer,
      changeTextStatus,
      changedValue: changeddescription,
      changeType: 1
    };
  } 
  return {
    type: MSGS.ANSWER_SHOW,
    id,
    showAnswer,
    changeTextStatus,
    changedValue: changedAnswer,
    changeType: 2
  };
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ANSWER_SHOW: {
      const id = msg.id ;

      const estimateData = msg.showAnswer;
      const estimate = estimateData.split(' ');
      const estimateText = estimate[0];
      const estimatescore = estimate[1];

      const toggle = msg.changeTextStatus;
      const neuValue = msg.changedValue;
      const oneCard = R.filter(
        card => card.id == id
      , model.cards);
      if (neuValue === "") {
        const card = {id:oneCard[oneCard.length - 1].id + 1, description:oneCard[0].description, back:oneCard[0].back, toggle: toggle, answerStatus: estimateText, score: estimatescore};
        const cards = [...model.cards, card]
        return {...model, cards, nextId: card.id, description: '',
        back: 0,
        showForm: false,
        toggle: toggle,
        answerStatus: ""
        };
      } else if (msg.changeType == 1) {
        const card = {id:oneCard[oneCard.length - 1].id + 1, description:neuValue, back:oneCard[0].back, toggle: toggle, answerStatus: estimateText, score: estimatescore};
        const cards = [...model.cards, card]
        console.log(cards);
        return {...model, cards, nextId: card.id, description: '',
        back: 0,
        showForm: false,
        toggle: toggle,
        answerStatus: ""
        };
      }
      const card = {id:oneCard[oneCard.length - 1].id + 1, description:oneCard[0].description, back:neuValue, toggle: toggle, answerStatus: estimateText, score: estimatescore};
      const cards = [...model.cards, card]
      console.log(cards);
      return {...model, cards, nextId: card.id, description: '',
      back: 0,
      showForm: false,
      toggle: toggle,
      answerStatus: ""
      };
    }
    case MSGS.SHOW_FORM: {
      const { showForm } = msg;
      return { ...model, showForm, description: '', back: 0 };
    }
    case MSGS.description_INPUT: {
      const { description } = msg;
      return { ...model, description };
    }
    case MSGS.ANSWER_INPUT: {
      const back = R.pipe( 
        R.defaultTo(0),
      )(msg.back);
      return { ...model, back };
    }
    case MSGS.SAVE_CARD: {
      const updatedModel = add(model);
      return updatedModel;
    }
    case MSGS.DELETE_CARD: {
      const { id } = msg;
      const cards = R.filter(
        card => card.id !== id
      , model.cards);
      return { ...model, cards };
    }
  }
  return model;
}

function add(model) {
  const { nextId, description, back, toggle } = model;
  const card = { id: nextId + 1, description, back, toggle:0};
  const cards = [...model.cards, card]
  return {
    ...model,
    cards,
    nextId: nextId + 1,
    description: '',
    back: 0,
    showForm: false,
    toggle: 0,
    score: 0
  };
}

module.exports = {update, MSGS, add, showFormMsg, frontInputMsg, backInputMsg, saveCardMsg, deleteCardMsg, showAnswer};