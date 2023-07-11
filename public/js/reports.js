const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");

const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");

const logoutBtn = document.getElementById("logoutBtn");
const dbtn = document.getElementById("dbtn");
// const axios = require("axios");



async function getDailyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const date = new Date(dateInput.value);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:2222/reports/dailyReports",
      {
        date: formattedDate,
      },
      { headers: { Authorization: token } }
    );

    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

async function getMonthlyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const month = new Date(monthInput.value);
    const formattedMonth = `${(month.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:2222/reports/monthlyReports",
      {
        month: formattedMonth,
      },
      { headers: { Authorization: token } }
    );

    tbodyMonthly.innerHTML = "";
    tfootMonthly.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyMonthly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootMonthly.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "monthlyTotal");
    td4.setAttribute("id", "monthlyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    
  } catch (error) {
    console.log(error);
  }
}

function download() {
  let token = localStorage.getItem("token");
  axios.get('http://localhost:2222/expense/user/download', { headers: { Authorization: token } })
.then((response)=>{
  console.log(response.data.url);
  let link = document.createElement("a");
  link.href = response.data.url;
  link.download = "expense.txt";
  document.body.appendChild(link);
  link.click();
}).catch(err =>{
  console.log(err);
});
//   const button = document.createElement("button")
//   button.textContent = "downloadbtn"
//   // button.classList.add("download")
//   button.addEventListener('click', () => {
//       //preventDefault()
//       const token = localStorage.getItem("token")
//       axios.get('http://localhost:2222/user/download', { headers: { Autherization: token } })
//           .then((response) => {
//               console.log(response, "this is download response")
//               if (response.status === 201) {
//                   //the bcakend is essentially sending a download link
//                   //  which if we open in browser, the file would download

//                   var a = document.createElement("a");
//                   a.href = response.data.url;
//                   a.download = 'myexpense.csv';
//                   a.click();
//                   console.log(response.data.url)
//                   showFileHistory()
//               } else {
//                   throw new Error(response.data.message)
//               }
//           })
//           .catch((err) => {
//               console.log(err)
//           });
//   })
// }

// async function showFileHistory() {
//   try {
//       const token = localStorage.getItem("token")
//       const allFiles = await axios.get("http://localhost:2222/premium/getfilehistory",
//           { headers: { Autherization: token } })
//       console.log(allFiles.data.files)
//       if (allFiles) {
//           document.getElementById("file-history").style.display = "block";
//           allFiles.data.files.forEach(file => {
//               const li = document.createElement("li")
//               li.innerHTML = `<a href=${file.fileUrl}>${file.fileName}</a>`
//               document.getElementById("file-history-ul").appendChild(li)
//           })
//       } else {
//           const item = document.createElement(li)
//           li.textContent = ("no file download history")
//           document.getElementById("file-history-ul").appendChild(item)
//       }
//   } catch (err) {
//       console.log(err)
//   }
}

async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
}

dateShowBtn.addEventListener("click", getDailyReport);
monthShowBtn.addEventListener("click", getMonthlyReport);
logoutBtn.addEventListener("click", logout);
dbtn.addEventListener("click",download);
