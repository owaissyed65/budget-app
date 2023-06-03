const monthSalary = document.querySelector('#monthSalary');
const setSalary = document.querySelector('#setSalary');
const tBudget = document.querySelector('#tBudget');
const tValue = document.querySelector('#tValue');
const tExpenses = document.querySelector('#tExpenses');
const setExpenses = document.querySelector('#setExpenses');
const expName = document.querySelector('#expName');
const expPrice = document.querySelector('#expPrice');
const validation = document.querySelector('#validation');
const validation1 = document.querySelector('#validation1');
const loopList = document.querySelector('#list');
const budget_update = document.querySelector('#budget_update');
let dlt;
let upd;
let budget = {
    salary: 0,
    expense: [],
    totalExpense: 0,
    totalVal: 0
};
let exist;
let check = false;
setSalary.addEventListener('click', () => {
    // if (budget.salary === 0) {
    //     check = true
    //     validation1.classList.add('yes')
    // } else {
    //     // budget.salary = Number(monthSalary.value);
    //     // tBudget.innerHTML = budget.salary
    //     // budget.totalVal = budget.totalVal + budget.salary
    //     // tValue.innerHTML = budget.totalVal
    //     validation1.classList.remove('yes')
    // }
    // if (check &&) {
    //     validation1.classList.remove('yes')
    //     check = false
    //     budget.salary = Number(monthSalary.value);
    //     monthSalary.value = '';
    //     tBudget.innerHTML = budget.salary
    //     budget.totalVal = budget.totalVal + budget.salary
    //     tValue.innerHTML = budget.totalVal
    // }
    // else {
    //     if (!check) {
    //         validation1.innerHTML = "You Can't add Budget Multiple's time"
    //     }
    // }
    if (budget.salary === 0 && monthSalary.value.trim() && Number(monthSalary.value) > 0) {
        budget_update.classList.remove("not")
        validation1.classList.add("not")
        budget.salary = Number(monthSalary.value);
        monthSalary.value = '';
        tBudget.innerHTML = budget.salary
        budget.totalVal =  budget.salary - budget.totalExpense
        tValue.innerHTML = budget.totalVal

    } else if ((budget.expense === 0 || budget.totalExpense <= Number(monthSalary.value)) && monthSalary.value.trim() && Number(monthSalary.value) > 0 && check && budget.salary > 0) {
        validation1.classList.add("not")
        budget.salary = Number(monthSalary.value);
        monthSalary.value = '';
        tBudget.innerHTML = budget.salary
        budget.totalVal = budget.salary - budget.totalExpense
        tValue.innerHTML = budget.totalVal
        check = false
    } else {
        validation1.classList.remove('not')
    }
})
budget_update.addEventListener('click', () => {
    monthSalary.value = budget.salary
    check = true
    monthSalary.scrollIntoView({
        behavior: "smooth",
        block: 'center'
    });
})
setExpenses.addEventListener('click', () => {
    let expense = {
        id: Date.now() + Math.random(),
        expName: expName.value,
        expPrice: Number(expPrice.value)
    }
    if (budget.salary !== null && expName.value.trim() && expName.value.trim()) {
        if (!exist) {
            validation.classList.remove('yes')
            condition(expense);
        }
        else {
            let upDate = {
                id: exist.id,
                expName: expName.value,
                expPrice: Number(expPrice.value)
            }
            let newValue = budget.salary - budget.totalExpense + exist.expPrice
            if (newValue < upDate.expPrice) {
                validation.classList.add('yes')
            } else {
                validation.classList.remove('yes')
                budget.expense = [...budget.expense].map((curEle) => {
                    if (curEle.id === upDate.id) {
                        return {
                            ...curEle,
                            id: upDate.id,
                            expName: upDate.expName,
                            expPrice: upDate.expPrice
                        }
                    }
                    return curEle
                })
                exist = null
                looping(budget)
                expName.value = '';
                expPrice.value = '';
                budget.totalExpense = budget.expense.reduce((acc, curEle) => acc + curEle.expPrice, 0);
                budget.totalVal = budget.salary - budget.totalExpense;
                tExpenses.innerText = budget.totalExpense;
                tValue.innerHTML = budget.totalVal
            }
        }
    } else {
        validation.classList.add('yes')
    }
})

const condition = (expense) => {
    budget.expense.push({ ...expense });
    budget.totalExpense = budget.expense.reduce((acc, curEle) => acc + curEle.expPrice, 0);
    if (budget.totalExpense > budget.salary) {
        budget.expense.pop()
        budget.totalExpense = budget.expense.reduce((acc, curEle) => acc + curEle.expPrice, 0);
        validation.classList.add('yes')
    }
    else {
        expName.value = '';
        expPrice.value = '';
        tExpenses.innerText = budget.totalExpense;
        budget.totalVal = budget.salary - budget.totalExpense;
        tValue.innerHTML = budget.totalVal
        looping(budget)
    }
}

const looping = (budget) => {
    list.innerHTML = ""
    budget.expense.forEach((curEle, i) => {
        list.innerHTML += `
        <div class="loopList" id="loopList">
        <div>
            <h5>Name</h5>
            <span>${curEle.expName}</span>
        </div>
        <div>
            <h5>Price</h5>
            <span>${curEle.expPrice}</span>
        </div>
        <div class="d-u">
            <div class="dlt border" id=${curEle.id}>X</div>
            <div class="update" id=${curEle.id}>&#9998;</div>
        </div>
    </div>`
    })
    dlt = document.querySelectorAll('.dlt');
    upd = document.querySelectorAll('.update');

    dlt.forEach((curEle) => {
        curEle.addEventListener('click', (e) => {            
            let ft = budget.expense.filter((p) => p.id !== Number(e.target.id))
            budget.expense = [...ft]
            looping(budget)
            budget.totalExpense = budget.expense.reduce((acc, curEle) => acc + curEle.expPrice, 0);
            budget.totalVal = budget.salary - budget.totalExpense;
            tExpenses.innerText = budget.totalExpense;
            tValue.innerHTML = budget.totalVal
            if (budget.expense.length === 0) {
                list.innerHTML = "Sorry there is No Any List"
            }
        })
    })

    upd.forEach((curEle) => {
        curEle.addEventListener('click', (e) => {
            let dt = budget.expense.find((p) => p.id === Number(e.target.id))
            expName.value = dt.expName;
            expPrice.value = dt.expPrice;
            expName.scrollIntoView({
                behavior: "smooth",
                block: 'center'
            });
            exist = updateTheList(e.target);
        })
    })
}
const updateTheList = (e) => {
    let data = budget.expense.find((p) => p.id === Number(e.id));
    return data
}
