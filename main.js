/*let [ reset, addFacts, remFacts, addOp, remOp, run, facts, ops, opResults ] = [
document.getElementById("reset"),
document.getElementById("add-factor"),
document.getElementById("remove-factor"),
document.getElementById("add-option"),
document.getElementById("remove-option"),
document.getElementById("run"),
document.getElementById("factors"),
document.getElementById("options"),
document.getElementById("options-results")
]*/


document.addEventListener("DOMContentLoaded", () => {
    let addFacts = document.getElementById("add-factor");
    let addOp = document.getElementById("add-option");
    let ops = document.getElementById("options");
    let opsResults = document.getElementById("options-results");
    let facts = document.getElementById("factors");
    let run = document.getElementById("run");

    let factsList = [];
    let optionsList = [];

/*   `
    <h2 class="title">Opcion 1</h2>
    <div class="values">
        <div class="value">
            1
        </div>
    </div>

`*/

    class OptionBuilder {
        
        constructor() {
            this.option = document.createElement("div");
            this.option.classList.add("option");
            this.option.innerHTML = `
                <input class="title-input" placeholder="Escribe Aqui"/>
                <div class="values">
                </div>
            `;
            this.title = this.option.getElementsByClassName("title-input")[0];
            this.opResult = document.createElement("div");
            this.opResult.classList.add("option-result");
            this.total = 0;
            this.values;
        }

        calculeTotal() {
            
            this.values = this.option.getElementsByClassName("value-input");
            let total = 0;
            for (let i = 0; i < factsList.length; i++)
                total += Number.parseInt(factsList[i].getNumberInput().value) * this.values[i].value;
            this.total = total;

        }

        createEmptyValue() {            
            let value = document.createElement("input");
            value.classList.add("value-input");
            value.setAttribute("placeholder", "nn");
            return value
        }

        addEmptyValues() {
            let values = this.option.getElementsByClassName("values")[0];
            for (let factor of factsList) values.appendChild(this.createEmptyValue());
        }

        addEmptyValue() {
            this.option.getElementsByClassName("values")[0].appendChild(this.createEmptyValue());
        }

        addEmptyOption() {
            optionsList.push(this);
            ops.appendChild(this.option);
            this.title.focus();
            opsResults.appendChild(this.opResult);
        }

        editTitle() {
            this.values = this.option.getElementsByClassName("value-input");
            this.title.addEventListener("keydown", event => {
                if (event.keyCode == 13) {
                    this.values[0].focus();
                }
            })
        }

        editValues() {

        }

        static bestOption() {
            let max = 0;
            let element = null;
            for (let option of optionsList) {
                if (Number.parseInt(option.total) > max) {
                    max = Number.parseInt(option.total);
                    element = option.option;
                }
            };
            return element;
        }

        static showCalc() {
            optionsList.forEach(e => {
                e.calculeTotal();
                e.opResult.innerHTML = e.total;
            })
            OptionBuilder.bestOption().classList.add("best-option");
        }

        static render() {
            let optionBuilder = new OptionBuilder();
            optionBuilder.addEmptyValues();
            optionBuilder.addEmptyOption();
            optionBuilder.editTitle();
        }

    }

    class FactorBuilder {

        constructor() {
            this.factor;
            this.editState = {
                text: false,
                num: false
            }
        }

        gerateEmptyFactor() {
            let newFactor = document.createElement("div");
            newFactor.classList.add("factor");
            newFactor.innerHTML = `
                <input class="iFacts" placeholder="Escriba aqui"/>
                <input class="iNum" placeholder="nn"/>
            `;
            this.factor = newFactor;
        }

        getTextInput() {
            return this.factor.getElementsByClassName("iFacts")[0];
        }

        getNumberInput() {
            let input = this.factor.getElementsByClassName("iNum")[0];
            return input;
        }
        
        addEmptyFactor() {
            facts.appendChild(this.factor);
        }

        setTextState(value) {
            this.editState.text = value;
        }
        
        setNumberState(value) {
            this.editState.num = value;
        }

        setText() {

            let value = addFacts.value;
            addFacts.value = "";

            let input = this.getTextInput();
            input.value = value;
            

        }
        
        editText() {

            let input = this.getTextInput();
            input.addEventListener("keydown", event => {

                if (event.keyCode == 8 && input.value == "") {
                    let position = factsList.indexOf(this);

                    if(factsList.length > 1 && position != 0) 
                        factsList[position - 1].getNumberInput().focus();
                    else 
                        addFacts.focus();
                    this.deleteSelf();

                }

                if (event.keyCode == 13) {
                    this.getNumberInput().focus();
                }

            })
        }

        editNumber() {

            let input = this.getNumberInput();
            input.focus();
            input.addEventListener("keydown", event => {
                if (event.keyCode == 8 && input.value == "") {
                    this.getTextInput().focus();
                }
                if (event.keyCode == 13)  {
                    addFacts.focus();
                    this.setNumberState(true);
                };
            })
            
        }

        deleteSelf() {

            factsList.splice(factsList.indexOf(this.factor), 1);
            facts.removeChild(this.factor);

        }

        static render() {

            let factorBuilder = new FactorBuilder();

            optionsList.forEach(e => e.addEmptyValue());

            factsList.push(factorBuilder);

            factorBuilder.gerateEmptyFactor();
            factorBuilder.addEmptyFactor();
            factorBuilder.setText();
            factorBuilder.editNumber();
            factorBuilder.editText();

        
        }

    }
    
    addFacts.addEventListener("keydown", event => {

        if (event.keyCode == 8 && factsList.length != 0 && addFacts.value == "")
            factsList[factsList.length - 1].getNumberInput().focus();
        if (event.keyCode == 13)
            FactorBuilder.render();

    });
    addOp.addEventListener("click", OptionBuilder.render);
    run.addEventListener("click", OptionBuilder.showCalc)

});