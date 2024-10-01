import Validate from './validate.js';
const validator = new Validate();

// Восстановление данных при загрузке страницы
window.addEventListener('load', () => {
    const savedResults = JSON.parse(localStorage.getItem('results')) || [];

    savedResults.forEach(result => {
        var table = document.getElementById("res-table"),
            tbody = table.getElementsByTagName("tbody")[0];
        var row = document.createElement("tr");
        var isHit = document.createElement("td");
        var x = document.createElement("td");
        var y = document.createElement("td");
        var r = document.createElement("td");
        var time = document.createElement("td");
        var worktime = document.createElement("td");

        isHit.innerText = result.isHit;
        x.innerText = result.x;
        y.innerText = result.y;
        r.innerText = result.r;
        time.innerText = result.time;
        worktime.innerText = result.workTime;

        row.appendChild(isHit);
        row.appendChild(x);
        row.appendChild(y);
        row.appendChild(r);
        row.appendChild(time);
        row.appendChild(worktime);
        tbody.appendChild(row);
    });
});

document.getElementById('send-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const x = document.querySelector('#coord-x');
    const y = document.querySelector('input[name="y"]:checked');
    const r = document.querySelector('#coord-r');
    const check = validator.check(x, y, r);
    if (check.allOk) {
        const coords = validator.getCoords();
        fetch(`http://localhost:8080/fcgi-bin/webb.jar?x=${coords.x}&y=${coords.y}&r=${coords.r}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.text();
            })
            .then(function (answer) {
                localStorage.setItem("session", answer);
                var res = JSON.parse(answer);
                var table = document.getElementById("res-table"),
                    tbody = table.getElementsByTagName("tbody")[0];
                var row = document.createElement("tr");
                var isHit = document.createElement("td");
                var x = document.createElement("td");
                var y = document.createElement("td");
                var r = document.createElement("td");
                var time = document.createElement("td");
                var worktime = document.createElement("td");
                if (res.error === 'all ok') {
                    document.getElementById("input-log").innerText = '';
                    if (res.result === "true"){
                        isHit.innerText = "Точно в цель";
                    }
                    else {
                        isHit.innerText = "Попробуйте ещё раз";
                    }

                    x.innerText = res.x;
                    y.innerText = res.y;
                    r.innerText = res.r;
                    time.innerText = res.time;
                    worktime.innerText = res.workTime;
                    row.appendChild(isHit);
                    row.appendChild(x);
                    row.appendChild(y);
                    row.appendChild(r);
                    row.appendChild(time);
                    row.appendChild(worktime);
                    tbody.appendChild(row);

                    document.getElementById("dot").setAttribute("cx", String(300 + Number(res.x) * (200 / Number(res.r))));
                    document.getElementById("dot").setAttribute("cy", String(300 - Number(res.y) * (200 / Number(res.r))));
                    document.getElementById("dot").setAttribute("visibility", "visible");

                    // Сохранение результата в localStorage
                    let results = JSON.parse(localStorage.getItem('results')) || [];
                    let result = {
                        isHit: isHit.innerText,
                        x: res.x,
                        y: res.y,
                        r: res.r,
                        time: res.time,
                        workTime: res.workTime
                    };
                    results.push(result);
                    localStorage.setItem('results', JSON.stringify(results));
                } else{
                    if (res.error === "fill")
                        document.getElementById("input-log").innerText = "Заполните все поля";
                    else if (res.error === "method")
                        document.getElementById("input-log").innerText = "Только GET запросы";
                }

            })
            .catch(error => {
                alert(`${error.message}`)
            })
    }
    else {
        document.getElementById("input-log").innerText = check.log;
    }
});
// Функция для очистки результатов
function clearResults() {
    // Очистка localStorage
    localStorage.removeItem('results');

    // Очистка таблицы результатов
    const tbody = document.getElementById("res-table").getElementsByTagName("tbody")[0];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Дополнительно можно скрыть точку на графике, если нужно
    document.getElementById("dot").setAttribute("visibility", "hidden");
}

// Добавление обработчика события на кнопку "Очистить результаты"
document.getElementById('clear-results-btn').addEventListener('click', clearResults);
