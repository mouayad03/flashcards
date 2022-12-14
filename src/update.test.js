const { add, MSGS, update, showFormMsg, questionInputMsg, answerInputMsg, saveCardMsg, deleteCardMsg, answerShow} = require("./Update.js");

test("add", () => {
    const model = { cards: [{},{}],nextId:1, question:"Hallo", answer:"Hello", toggle:0};
    const newModel = add(model);
    expect(newModel.answer).toBe("Hello");
    expect(newModel.cards[2].id).toBe(model.nextId + 1);
    expect(newModel.cards[2].question).toBe("Hallo");
    expect(newModel.cards[2].toogle).toBe(0);
  });
test("showFormMsg", () => {
    const falseShow = showFormMsg(false);
    const trueShow = showFormMsg(true);
    expect(falseShow.type).toBe("SHOW_FORM");
    expect(trueShow.type).toBe("SHOW_FORM");
    expect(falseShow.showForm).toBe(false);
    expect(trueShow.showForm).toBe(true);
});