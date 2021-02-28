const URL =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(URL)
  .then(function (response) {
    return response.json();
  })
  .then((data) => {
    let tbody = document.querySelector("#events");
    for (let i in data) {
      let row = document.createElement("tr");

      let rankText = document.createTextNode(parseInt(i) + 1);
      let rank = document.createElement("td");
      rank.appendChild(rankText);
      row.appendChild(rank);

      let eventText = document.createTextNode(data[i].events.join(", "));
      let event = document.createElement("td");
      event.appendChild(eventText);
      row.appendChild(event);

      let valueText = document.createTextNode(data[i].squirrel);
      let value = document.createElement("td");
      if (data[i].squirrel === true) {
        row.className = "table-danger";
      }
      value.appendChild(valueText);
      row.appendChild(value);

      tbody.appendChild(row);
    }

    let events = {};
    positives = 0;
    negatives = 0;
    for (let d of data) {
      d.events.forEach((e) => {
        if (!(e in events)) {
          events[e] = [0, 0]; //TP, FN
        }
        if (d.squirrel) {
          events[e][0] += 1;
        } else {
          events[e][1] += 1;
        }
      });
      if (d.squirrel) {
        positives += 1;
      } else {
        negatives += 1;
      }
    }

    Object.keys(events).map(function (key) {
      let TP = events[key][0];
      let FN = events[key][1];
      let FP = positives - TP;
      let TN = negatives - FN;

      events[key] =
        (TP * TN - FP * FN) /
        Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
    });

    events = Object.keys(events).map(function (key) {
      return [key, events[key]];
    });

    events.sort(function (first, second) {
      return second[1] - first[1];
    });

    tbody = document.querySelector("#correlation");
    for (let i in events) {
      let row = document.createElement("tr");

      let rankText = document.createTextNode(parseInt(i) + 1);
      let rank = document.createElement("td");
      rank.appendChild(rankText);
      row.appendChild(rank);

      let eventText = document.createTextNode(events[i][0]);
      let event = document.createElement("td");
      event.appendChild(eventText);
      row.appendChild(event);

      let valueText = document.createTextNode(events[i][1]);
      let value = document.createElement("td");
      value.appendChild(valueText);
      row.appendChild(value);

      tbody.appendChild(row);
    }
  });
