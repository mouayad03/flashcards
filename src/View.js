const hh = require("hyperscript-helpers");
const { h } = require("virtual-dom");
const R = require('ramda');
const { showFormMsg, frontInputMsg, backInputMsg, saveCardMsg, deleteCardMsg, showAnswer } = require("./Update.js");

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

const { div, button, form, label, input, table, tbody, tr, td, textarea } = hh(h);

function cell(tag, className, value) {
  return tag({ className }, value);
}

function cardRow(dispatch, className, card) {
  if (card.toggle == 0) {
    return tr({ className: "text-left" }, [
      div({className: "w-80 h-80 bg-amber-300 inline-block ml-2 text-ellipsis overflow-hidden"}, [
      cell(td, "px-1 py-2 text-left font-bold ...", "Question"),
      cell(td, "text-center", [button({
        className: "hover:bg-gray-200 p-2 rounded",
        onclick: () => dispatch(deleteCardMsg(card.id)),
      },
      "🗑"
      ),
      ]),
      cell(div, "px-1 py-2", card.description),
      div({className:"hover:bg-gray-200 text-sm underline", onclick: () => dispatch(showAnswer(card.id))}, "Show Answer"),
      cell(div, "px-1 py-2 text-right", ""),
  ]),
]);
  } else if (card.toggle == 1) {
    return tr({ className: "text-left" }, [
      div({className: "w-80 h-80 bg-amber-300 inline-block ml-2 text-ellipsis overflow-hidden" }, [
      cell(td, "px-1 py-2 text-left font-bold ...", "Question"),
      cell(td, "text-center", [button({
        className: "hover:bg-gray-200 p-2 rounded",
        onclick: () => dispatch(deleteCardMsg(card.id)),
      },
      "🗑"
      ),
      ]),
      div({className:"px-1 py-2 text-left", onclick: () => dispatch(showAnswer(card.id, card.answerStatus, 2)) }, card.description),
      cell(div, "px-1 py-2 text-left font-bold ...", "Answer"),
      div({className:"px-1 py-2 text-left", onclick: () => dispatch(showAnswer(card.id, card.answerStatus, 2)) }, card.back),
      cell(td, "px-1 py-2 text-left font-bold ...", "Score: " + card.answerStatus),
      div({className:"min-w-[100px] min-h-[50px]  text-[20px] ml-[50px]"},[ 
        button({
          className: "bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded ml-2",
          onclick: () => dispatch(showAnswer(card.id,"2"))
        }, "Great"),
        button({
          className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded ml-2",
          onclick: () => dispatch(showAnswer(card.id,"1"))
        }, "Good"),
        button({
          className: "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded ml-2",
          onclick: () => dispatch(showAnswer(card.id,"0"))
        }, "Bad"),
      ]),
      ]),
    ]);
  } 
  return tr({ className: "text-left" }, [
    div({className: "w-80 h-80 bg-amber-300 inline-block ml-2 text-ellipsis overflow-hidden"}, [
    cell(div, "px-1 py-2 text-left", "Frontcard"),
    textarea({className:"px-1 py-2", onchange: (e) => dispatch(showAnswer(card.id, card.answerStatus, 1, e.target.value))}, card.description),
    div({className:"px-1 py-2 text-left"}, "Backcard"),
    textarea({className:"px-1 py-2", onchange: (e) => dispatch(showAnswer(card.id, card.answerStatus, 1, "", e.target.value))}, card.back),
    cell(div, "px-1 py-2 text-left", "Answer: " + card.answerStatus),
    div({className:""},[ 
      button({
        className: "bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded ml-2",
        onclick: () => dispatch(showAnswer(card.id,"2"))
      }, "Great"),
      button({
        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded ml-2",
        onclick: () => dispatch(showAnswer(card.id,"Ok 1"))
      }, "Good"),
      button({
        className: "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded ml-2",
        onclick: () => dispatch(showAnswer(card.id,"Bad 0"))
      }, "Bad"),
    ]),
    ]),
    cell(td, "text-center", [button({
          className: "hover:bg-gray-200 p-2 rounded text-[50px]",
          onclick: () => dispatch(deleteCardMsg(card.id)),
        },
        "🗑"
      ),
    ]),
  ]);
}

function cardsBody(dispatch, className, cards) {
  const rows = R.map(R.partial(cardRow, [dispatch, "border-t-[20px] border-b-[20px] border-transparent"]), cards);
  return tbody({ className }, rows);
}

function tableView(dispatch, cards) {
  if (cards.length === 0) {
    return div({ className: "pt-8 text-center" }, "No Cards yet...");
  }
  return table({ className: "mt-4" }, [cardsBody(dispatch, "", cards)]);
}

function fieldSet(labelText, inputValue, placeholder, oninput) {
  return div({ className: "grow flex flex-col" }, [
    label({ className: "text-gray-700 text-sm font-bold mb-2" }, labelText),
    input({
      className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700",
      placeholder,
      type: "text",
      value: inputValue,
      oninput,
    }),
  ]);
}

function buttonSet(dispatch) {
  return div({ className: "flex gap-4 justify-end" }, [
    button(
      {
        className: `${btnStyle} bg-green-500 hover:bg-green-700`,
        type: "submit",
      },
      "Save"
    ),
    button(
      {
        className: `${btnStyle} bg-red-500 hover:bg-red-700`,
        type: "button",
        onclick: () => dispatch(showFormMsg(false)),
      },
      "Cancel"
    ),
  ]);
}

function formView(dispatch, model) {
  const { description, back, showForm } = model;
  if (showForm) {
    return form(
      {
        className: "flex flex-col gap-4",
        onsubmit: (e) => {
          e.preventDefault();
          dispatch(saveCardMsg);
        },
      },
      [
        div({ className: "flex gap-4" }, [
          fieldSet("Frontcard", description, "Enter Frontcard text...", (e) => dispatch(frontInputMsg(e.target.value))),
          fieldSet("Backcard", back || "", "Enter Backcard text...", (e) => dispatch(backInputMsg(e.target.value))),
        ]),
        buttonSet(dispatch),
      ]
    );
  }
  return button({
      className: `${btnStyle} max-w-xs ml-[170px]`,
      onclick: () => dispatch(showFormMsg(true)),
    },
    "➕ Flashcard"
  );
}

function view(dispatch, model) {
  return div({ className: "flex flex-col" }, [formView(dispatch, model), tableView(dispatch, model.cards)]);
}

module.exports = {view, tableView};