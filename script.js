var arrHead = new Array();
arrHead = ['', 'PID', 'Arrival Time', 'Burst Time'];

var n, procInfo, quantum, procIds, ArrTime, BurstTime, avgTAT, readyqueue,
    avgWT, avgRT, t, finish, actat, ganttchart, timestamp,
    visited, attributes, newBurstTime, tat, wt, ct, rt;

function initialize() {
    actat = new Array(n); 
    ganttchart = new Array();
    timestamp = new Array();
    newBurstTime = new Array(n);
    visited = new Array(n); 
    t = 0; 
    finish = 0; 
    avgRT = 0; 
    avgTAT = 0;
    avgWT = 0;
    tat = new Array(n);
    wt = new Array(n);
    ct = new Array(n);
    rt = new Array(n);

    procInfo = document.getElementById('procTable'); 
    
    procIds = new Array();
    ArrTime = new Array();
    BurstTime = new Array();

    
    for (let row = 1; row < procInfo.rows.length - 1; row++) {
        
        for (let c = 1; c < procInfo.rows[row].cells.length; c++) {
            var element = procInfo.rows.item(row).cells[c];
            
            if (c == 1) {
                procIds.push(element.childNodes[0].value);
            }
            
            else if (c == 2) {
                let arrivalTime = element.childNodes[0].value;
                if (!Number.isInteger(Number(arrivalTime)) || Number(arrivalTime) < 0) {
                    alert("Error: Arrival Time must be a non-negative integer");
                    return;
                }
                ArrTime.push(Number(arrivalTime));
            }
            
            else {
                let burstTime = element.childNodes[0].value;
                if (!Number.isInteger(Number(burstTime)) || Number(burstTime) <= 0) {
                    alert("Error: Burst Time must be greater than zero");
                    return;
                }
                BurstTime.push(Number(burstTime));
            }
        }
    }
    n = procIds.length; 
    if (n === 0) {
        alert("Error: Please add at least one process");
        return;
    }

    
    for (let i = 0; i < n; i++) {
        newBurstTime[i] = BurstTime[i];
    }

    
    for (let i = 0; i < n; i++) {
        visited[i] = 0;
        actat[i] = -1;
    }

    
    var sel = document.getElementById("algo");
    selected = sel.options[sel.selectedIndex].text;

    
    if (selected == "First Come First Serve") {
        FCFS();
    }
    else if (selected == "Shortest Remaining Time Next") {
        SRTN();
    }
    else if (selected == "Round Robin") {
        RR();
    }
    else if (selected == "Shortest Job First") {
        SJF();
    }
}


function onsel() {
    var sel = document.getElementById("algo");
    selected = sel.options[sel.selectedIndex].text;
    var x1 = document.getElementById('timeq');
    var x2 = document.getElementById('queues');

    
    if (selected != "Round Robin") {
        x1.style.display = "none";
        x2.style.display = "none";
    }
    else {
        x1.style.display = "block";
        x2.style.display = "block";
    }
}


function createTable() {
    var procTable = document.createElement('table');
    procTable.setAttribute('id', 'procTable');

    
    var tr = procTable.insertRow(-1);
    for (var h = 0; h < arrHead.length; h++) {
        var th = document.createElement('th');
        th.innerHTML = arrHead[h];
        tr.appendChild(th);
    }

    
    var div = document.getElementById('cont');
    div.appendChild(procTable);
}


function addProcess() {
    var process = document.getElementById('procTable');
    var rowCnt = process.rows.length;
    var tr = process.insertRow(rowCnt);
    tr = process.insertRow(rowCnt);

    
    for (var c = 0; c < arrHead.length; c++) {
        var td = document.createElement('td');
        td = tr.insertCell(c);

        
        if (c == 0) {
            var button = document.createElement('input');
            button.setAttribute('id', 'rembut');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'X');
            button.setAttribute('onclick', 'removeRow(this)');
            td.appendChild(button);
        }
        
        else {
            var ele = document.createElement('input');
            ele.setAttribute('type', 'text');
            ele.setAttribute('value', '');
            td.appendChild(ele);
        }
    }
}


function removeRow(oButton) {
    var process = document.getElementById('procTable');
    process.deleteRow(oButton.parentNode.parentNode.rowIndex);
}


function RR() {
    quantum = document.getElementById('quantum').value; 
    if (quantum < 1) {
        alert("Error: Time Quantum must be greater than or equal to 1");
        return;
    }
    readyqueue = new Array();
    timestamp.push(0);
    var last;
    var mint = 100000;

    
    for (let i = 0; i < n; i++) {
        if (mint > ArrTime[i]) {
            mint = ArrTime[i];
            last = i;
        }
    }

    var k = 0;
    
    if (ArrTime[last] > 0) {
        ganttchart.push(-1);
        timestamp.push(ArrTime[last]);
    }

    
    t = ArrTime[last];
    
    actat[last] = t;
    
    readyqueue.push(last);
    
    visited[last] = 1;

    
    while (true) {
        if (readyqueue.length > k) {
            
            ganttchart.push(procIds[readyqueue[k]]);

            
            if (actat[readyqueue[k]] == -1) {
                actat[readyqueue[k]] = t;
            }

            
            temp = Math.min(newBurstTime[readyqueue[k]], quantum);
            t += temp;
            timestamp.push(t);
            newBurstTime[readyqueue[k]] -= temp;
            
            if (newBurstTime[readyqueue[k]] == 0) {
                finish++;
                ct[readyqueue[k]] = t;
                
                if (finish == n) {
                    break;
                }
            }
            last = readyqueue[k];
            k++;
        }
        else {
            
            ganttchart.push(-1);
            var time;
            var flag = 0;
            for (time = t; flag == 0; time++) {
                for (var i = 0; i < n; i++) {
                    if (ArrTime[i] <= time && newBurstTime[i] > 0 && visited[i] != 1) {
                        flag = 1;
                        break;
                    }
                }
            }
            t = time - 1;
            timestamp.push(t);
        }

        
        for (let i = 0; i < n; i++) {
            if (ArrTime[i] <= t && newBurstTime[i] > 0 && visited[i] != 1) {
                readyqueue.push(i);
                visited[i] = 1;
            }
        }

        
        if (newBurstTime[last] > 0) {
            readyqueue.push(last);
        }
    }
    
    show();
}


function FCFS() {
    
    while (finish < n) {
        var minat = 10000, idx;
        
        for (let i = 0; i < n; i++) {
            if (visited[i] != 1 && minat > ArrTime[i]) {
                minat = ArrTime[i];
                idx = i;
            }
        }
        
        if (minat > t) {
            timestamp.push(t);
            ganttchart.push(-1);
            t = minat;
        }
        
        timestamp.push(t);
        visited[idx] = 1;
        ganttchart.push(procIds[idx]);
        actat[idx] = t;
        
        t += BurstTime[idx];
        ct[idx] = t;
        finish++;
    }
    
    timestamp.push(t);
    show();
}


function SJF() {
    
    while (finish < n) {
        var minat = 10000, minbt = 10000, idx;
        
        for (let i = 0; i < n; i++) {
            if (visited[i] != 1 && minat > ArrTime[i]) {
                minat = ArrTime[i];
            }
        }
        
        if (minat > t) {
            timestamp.push(t);
            ganttchart.push(-1);
            t = minat;
        }
        timestamp.push(t);
        
        for (let i = 0; i < n; i++) {
            if (ArrTime[i] <= t && visited[i] != 1 && minbt > BurstTime[i]) {
                minbt = BurstTime[i];
                idx = i;
            }
        }
        
        visited[idx] = 1;
        ganttchart.push(procIds[idx]);
        actat[idx] = t;
        
        t += minbt;
        ct[idx] = t;
        finish++;
    }
    
    timestamp.push(t);
    show();
}


function SRTN() {
    
    while (finish < n) {
        var minat = 10000, minbt = 10000, idx;
        
        for (let i = 0; i < n; i++) {
            if (visited[i] != 1 && minat > ArrTime[i]) {
                minat = ArrTime[i];
            }
        }
        
        if (minat > t) {
            timestamp.push(t);
            ganttchart.push(-1);
            t = minat;
        }
        
        for (let i = 0; i < n; i++) {
            if (ArrTime[i] <= t && visited[i] != 1 && minbt > newBurstTime[i]) {
                minbt = newBurstTime[i];
                idx = i;
            }
        }
        
        if (ganttchart[ganttchart.length - 1] != procIds[idx]) {
            ganttchart.push(procIds[idx]);
            timestamp.push(t);
        }
        
        if (BurstTime[idx] == newBurstTime[idx]) {
            actat[idx] = t;
        }
        
        t++;
        newBurstTime[idx]--;
        
        if (newBurstTime[idx] == 0) {
            visited[idx] = 1;
            finish++;
            ct[idx] = t;
        }
    }
    
    timestamp.push(t);
    show();
}


function show() {
    
    document.getElementById('readyqueue').innerHTML = "";
    document.getElementById('ganttchart').innerHTML = "";
    document.getElementById('timestamp').innerHTML = "";
    document.getElementById('ProcessTable').innerHTML = "";

    
    for (let i = 0; i < n; i++) {
        tat[i] = ct[i] - ArrTime[i];
        avgTAT += tat[i];
        wt[i] = tat[i] - BurstTime[i];
        avgWT += wt[i];
        rt[i] = actat[i] - ArrTime[i];
        avgRT += rt[i];
    }

    
    avgTAT /= n;
    avgWT /= n;
    avgRT /= n;

    
    var sel = document.getElementById("algo");
    selected = sel.options[sel.selectedIndex].text;

    
    if (selected == "Round Robin") {
        var table1 = document.getElementById("readyqueue");
        var col = readyqueue.length;

        var tr = document.createElement('tr');
        for (let colidx = 0; colidx < col; colidx++) {
            var td = document.createElement('td');
            var text = document.createTextNode(procIds[readyqueue[colidx]]);
            td.appendChild(text);
            tr.appendChild(td);
        }
        table1.appendChild(tr);
    }

    
    var table2 = document.getElementById("ganttchart");
    var col = ganttchart.length;

    var tr = document.createElement('tr');
    for (let colidx = 0; colidx < col; colidx++) {
        var td = document.createElement('td');
        if (ganttchart[colidx] == -1) {
            var text = document.createTextNode("-");
        }
        else {
            var text = document.createTextNode(ganttchart[colidx]);
        }
        td.appendChild(text);
        tr.appendChild(td);
    }
    table2.appendChild(tr);

    
    var table3 = document.getElementById("timestamp");
    var col = timestamp.length;

    var tr = document.createElement('tr');
    for (let colidx = 0; colidx < col; colidx++) {
        var td = document.createElement('td');
        var text = document.createTextNode(timestamp[colidx]);
        td.appendChild(text);
        tr.appendChild(td);
    }
    table3.appendChild(tr);

    
    var attributes = new Array(7);
    attributes[0] = "PID";
    attributes[1] = "Arrival Time";
    attributes[2] = "Burst Time";
    attributes[3] = "Finish Time";
    attributes[4] = "Turn Around Time";
    attributes[5] = "Waiting Time";
    attributes[6] = "Response Time";

    var table4 = document.getElementById("ProcessTable");
    var col = 7;
    var row = n + 2;

    for (let i = 0; i < row; i++) {
        var tr = document.createElement('tr');
        if (i == 0) {
            for (let colidx = 0; colidx < col; colidx++) {
                var td = document.createElement('td');
                var text = document.createTextNode(attributes[colidx]);
                td.appendChild(text);
                tr.appendChild(td);
            }
            table4.appendChild(tr);
        }
        else if (i <= n) {
            for (let colidx = 0; colidx < col; colidx++) {
                if (colidx == 0) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(procIds[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 1) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(ArrTime[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 2) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(BurstTime[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 3) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(ct[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 4) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(tat[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 5) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(wt[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else {
                    var td = document.createElement('td');
                    var text = document.createTextNode(rt[i - 1]);
                    td.appendChild(text);
                    tr.appendChild(td);
                }
            }
            table4.appendChild(tr);
        }
        else {
            for (let colidx = 0; colidx < col; colidx++) {
                if (colidx == 0) {
                    var td = document.createElement('td');
                    var text = document.createTextNode("");
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 1) {
                    var td = document.createElement('td');
                    var text = document.createTextNode("");
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 2) {
                    var td = document.createElement('td');
                    var text = document.createTextNode("");
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 3) {
                    var td = document.createElement('td');
                    var text = document.createTextNode("Average");
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 4) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(avgTAT.toFixed(2));
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else if (colidx == 5) {
                    var td = document.createElement('td');
                    var text = document.createTextNode(avgWT.toFixed(2));
                    td.appendChild(text);
                    tr.appendChild(td);
                }
                else {
                    var td = document.createElement('td');
                    var text = document.createTextNode(avgRT.toFixed(2));
                    td.appendChild(text);
                    tr.appendChild(td);
                }
            }
            table4.appendChild(tr);
        }
    }
}

document.getElementById("bt").addEventListener("click", initialize);

document.getElementById("addprocess").addEventListener("click", addProcess);
