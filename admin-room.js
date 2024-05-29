import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  deleteObject,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWhH4qYxVx2NWYUNnkY7rfviGEelwg7oQ",
  authDomain: "haushelper-12f14.firebaseapp.com",
  projectId: "haushelper-12f14",
  storageBucket: "haushelper-12f14.appspot.com",
  messagingSenderId: "945052022593",
  appId: "1:945052022593:web:e6889785d166df5e0653c0",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

var newEvents = {};
var workerColors = {};

//image list for each building
var geb_image_map = {};

var geb_image_map_info = {};

//pdf map
var geb_pdf_map = {};

//task done counter map for dahboard
var taskDoneCounter = {};

//list for tasks for worker layover
var worker_layover_task_today_list = {};

let signOutButton = document.getElementById("signout-button");

if (typeof signOutButton !== null) {
  signOutButton.addEventListener("click", handleSignOut);
}

//datenschutz link
document
  .getElementById("datenschutz_link")
  .addEventListener("click", function () {
    window.location.href = "/datenschutz-impressum";
  });

//today text

var today = new Date();

var day = ("0" + today.getDate()).slice(-2);
var month = ("0" + (today.getMonth() + 1)).slice(-2);
var year = today.getFullYear();
var formattedDate = day + "." + month + "." + year;
document.getElementById("day").innerHTML = formattedDate;
document.getElementById("day3").innerHTML = formattedDate;

//tab links
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get("tab");
  if (tab) {
    const tabButton = document.getElementById(tab);
    tabButton.click();
  }
};

async function getFirstFileNameInFolder(folderPath) {
  try {
    const folderRef = ref(storage, folderPath);
    const { items } = await listAll(folderRef);

    if (items && items.length > 0) {
      const firstFileRef = items[0];
      const firstFileName = firstFileRef.name;
      const firstFileMetadata = await getMetadata(firstFileRef);
      const firstFileModifiedTimestamp = firstFileMetadata.updated;
      const formattedModifiedDate = new Date(
        firstFileModifiedTimestamp
      ).toLocaleString("de-DE");
      return { fileName: firstFileName, modifiedDate: formattedModifiedDate };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
function handleSignOut() {
  signOut(auth)
    .then(() => {})
    .catch((error) => {
      const errorMessage = error.message;
    });
}

let GForm = document.getElementById("geb_form");
let AForm = document.getElementById("task_form");

//disable/enable buttons
const taskForm = document.getElementById("task_form");
const inputFieldsTasks = taskForm.querySelectorAll("input");
const submitButtonTasks = taskForm.querySelector("#submit-task");
const timeEndInput = document.getElementById("time_end");

submitButtonTasks.setAttribute("disabled", true);
submitButtonTasks.style.backgroundColor = "rgba(17, 18, 19, 0.15)";

inputFieldsTasks.forEach((input) => {
  input.addEventListener("input", toggleButtonStateTasks);
});

function toggleButtonStateTasks() {
  let allFieldsFilled = true;

  const frequencyValue = document.querySelector(
    'input[name="frequency"]:checked'
  ).value;

  inputFieldsTasks.forEach((input) => {
    if (!(input.id === "time_end" && frequencyValue === "einmalig")) {
      if (input.value.trim() === "") {
        allFieldsFilled = false;
      }
    }
  });

  if (allFieldsFilled) {
    submitButtonTasks.removeAttribute("disabled");
    submitButtonTasks.style.backgroundColor = "black";
  } else {
    submitButtonTasks.setAttribute("disabled", true);
    submitButtonTasks.style.backgroundColor = "rgba(17, 18, 19, 0.15)";
  }
}

const GebForm = document.getElementById("geb_form");
const inputFieldsGeb = GebForm.querySelectorAll("input");
const submitButtonGeb = GebForm.querySelector("#submit_geb");

submitButtonGeb.setAttribute("disabled", true);
submitButtonGeb.style.backgroundColor = "rgba(17, 18, 19, 0.15)";

inputFieldsGeb.forEach((input) => {
  input.addEventListener("input", toggleButtonStateGeb);
});

function toggleButtonStateGeb() {
  let allFieldsFilled = true;

  inputFieldsGeb.forEach((input) => {
    if (input.value.trim() === "") {
      allFieldsFilled = false;
    }
  });

  if (allFieldsFilled) {
    submitButtonGeb.removeAttribute("disabled");
    submitButtonGeb.style.backgroundColor = "black";
  } else {
    submitButtonGeb.setAttribute("disabled", true);
    submitButtonGeb.style.backgroundColor = "rgba(17, 18, 19, 0.15)";
  }
}

//mitarbeiter hinzufügen:
const WForm = document.getElementById("worker_form");
const inputFieldsW = WForm.querySelectorAll("input");
const submitButtonW = WForm.querySelector("#submit_worker");

submitButtonW.setAttribute("disabled", true);
submitButtonW.style.backgroundColor = "rgba(17, 18, 19, 0.15)";

inputFieldsW.forEach((input) => {
  input.addEventListener("input", toggleButtonStateW);
});

function toggleButtonStateW() {
  let allFieldsFilled = true;
  let is_w_available = true;
  let w_available;

  const companiesDocRef = doc(collection(db, "Companies"), companyName);
  const accessesRef = collection(companiesDocRef, "Accesses");

  getDocs(accessesRef).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      w_available = parseInt(doc.data().userAvailable);
      if (w_available == 0) {
        is_w_available = false;
      }
    });

    inputFieldsW.forEach((input) => {
      if (input.value.trim() === "") {
        allFieldsFilled = false;
      }
    });

    if (allFieldsFilled && is_w_available) {
      submitButtonW.removeAttribute("disabled");
      submitButtonW.style.backgroundColor = "black";
    } else {
      submitButtonW.setAttribute("disabled", true);
      submitButtonW.style.backgroundColor = "rgba(17, 18, 19, 0.15)";
    }
  });
}

//end disable/enable buttons

var companyName;
var admin_mail;

var mitarbeiter_Calender_Select = document.getElementById("worker_cal_select");
var mitarbeiter_List = document.getElementById("mitarbeiter_select");
var gebaude_List = document.getElementById("gebaude_select");
const gebaudeDictionary = {};

if (typeof GForm !== null) {
  GForm.addEventListener("submit", handleGForm, true);
}

if (typeof AForm !== null) {
  AForm.addEventListener("submit", handleAForm, true);
}

if (typeof WForm !== null) {
  WForm.addEventListener("submit", handleWForm, true);
}

function handleWForm(e) {
  e.preventDefault();
  e.stopPropagation();
  const nameW = document.getElementById("name_worker").value;
  const emailW = document.getElementById("email_worker").value;
  const passwortW = document.getElementById("passwort_worker").value;

  // Erstelle einen neuen Benutzer in Firebase Auth
  // createUserWithEmailAndPassword(auth, emailW, passwortW)
  //   .then((userCredential) => {
  //     // Benutzer erfolgreich erstellt
  //     const user = userCredential.user;

  //     const userRef = collection(db, "Users");
  //     const doc_data1 = {
  //       company: companyName,
  //       email: emailW,
  //     };
  //     // addDoc(userRef, doc_data1);

  //     // Füge den neuen Benutzer zur Firestore-Datenbank hinzu

      const companiesDocRef = doc(collection(db, "Companies"), companyName);
  //     const newSubcollectionRef = collection(companiesDocRef, "Users");
      const accessesRef = collection(companiesDocRef, "Accesses");
      getDocs(accessesRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let w_available = parseInt(doc.data().userAvailable); // Konvertiere in Ganzzahl

          if (!isNaN(w_available)) {
            w_available = Math.max(w_available - 1, 0);

            updateDoc(doc.ref, { userAvailable: w_available.toString() })
              .then(() => {
                console.log(
                  "Anzahl verfügbarer Benutzer erfolgreich aktualisiert"
                );
              })
              .catch((error) => {
                console.error(
                  "Fehler beim Aktualisieren der Anzahl verfügbarer Benutzer:",
                  error
                );
              });
           return;
          } else {
            console.error(
              "Ungültiger Wert für w_available:",
              doc.data().userAvailable
            );
          }
        });
      });

  //     const newDocumentData2 = {
  //       name: nameW,
  //       email: emailW,
  //     };
  //     addDoc(newSubcollectionRef, newDocumentData2);

  //     alert(`Mitarbeiter erfolgreich hinzugefügt! Du wirst aus Sicherheitsgründen ausgeloggt und kannst dich gleich danach wieder einloggen.`);
  //     window.location.href = "/login";
  //   })
  //   .catch((error) => {
  //     // Fehler beim Erstellen des Benutzers
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     console.error(errorMessage);
  //     alert(errorMessage);
  //   });

  const requestBody = {
    name: nameW,
    email: emailW,
    password: passwortW,
    company: companyName,
  };

  fetch("https://haushelper-bot-4584298bee33.herokuapp.com/register_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Registrierung erfolgreich über Bot!");
            alert(`Mitarbeiter erfolgreich hinzugefügt!.`);
            window.location.href = "/adminroom?tab=mitarbeiter-tab";

      } else {
        console.error("Fehler beim Registrieren:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Fehler beim Registrieren:", error);
    });
}

function handleGForm(e) {
  e.preventDefault();
  e.stopPropagation();
  const street = document.getElementById("str_geb").value;
  const plz = document.getElementById("plz_geb").value;
  const locationV = document.getElementById("standort_geb").value;
  const companiesDocRef = doc(collection(db, "Companies"), companyName);
  const newDocumentData2 = {
    address: street,
    city: locationV,
    zipcode: plz,
    counterelectricity: "0",
    countergas: "0",
    counterwater: "0",
    information: "[[]]",
  };
  const newSubcollectionRef = collection(companiesDocRef, "Buildings");
  addDoc(newSubcollectionRef, newDocumentData2);
  alert(`Gebäude erfolgreich hinzugefügt!`);
  window.location.href = "/adminroom?tab=gebaude-tab";
}

function handleAForm(e) {
  e.preventDefault();
  e.stopPropagation();
  const titel_task = document.getElementById("titel_task").value;
  const beschreibung_task = document.getElementById("beschreibung_task").value;
  const time_task = document.getElementById("time_task").value;
  const time_end = document.getElementById("time_end").value;
  const checked = document.querySelector("input[type=radio]:checked").value;
  var mitarbeiterOption =
    mitarbeiter_List.options[mitarbeiter_List.selectedIndex].value;
  var gebaudeOption = gebaude_List.options[gebaude_List.selectedIndex].value;
  const house = gebaudeDictionary[gebaudeOption];
  const formatted_gebaude = house.address + "," + " (" + house.zipcode + ")";
  const companiesDocRef = doc(collection(db, "Companies"), companyName);
  const newSubcollectionRef = collection(companiesDocRef, "Tasks");
  if (checked == "einmalig") {
    const newDocumentData = {
      assignee: mitarbeiterOption,
      description: beschreibung_task,
      title: titel_task,
      issued: new Date(time_task),
      building: formatted_gebaude,
      buildingID: house.id,
      done: new Date("2000-01-01T01:00:00+01:00"),
      repeat: checked,
    };
    addDoc(newSubcollectionRef, newDocumentData);
    alert(`Einmalige Aufgabe erfolgreich hinzugefügt!`);
    window.location.href = "/adminroom?tab=aufgaben-tab";
  }
  if (checked == "täglich") {
    var currentDate = new Date(time_task);
    const endDate = new Date(time_end);
    while (currentDate <= endDate) {
      const newDocumentData = {
        assignee: mitarbeiterOption,
        description: beschreibung_task,
        title: titel_task,
        issued: new Date(currentDate),
        building: formatted_gebaude,
        buildingID: house.id,
        done: new Date("2000-01-01T01:00:00+01:00"),
        repeat: checked,
      };
      addDoc(newSubcollectionRef, newDocumentData);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    alert(`Tägliche Aufgaben erfolgreich hinzugefügt!`);
    window.location.href = "/adminroom?tab=aufgaben-tab";
  }
  if (checked == "wöchentlich") {
    var currentDate = new Date(time_task);
    const endDate = new Date(time_end);
    while (currentDate <= endDate) {
      const newDocumentData = {
        assignee: mitarbeiterOption,
        description: beschreibung_task,
        title: titel_task,
        issued: new Date(currentDate),
        building: formatted_gebaude,
        buildingID: house.id,
        done: new Date("2000-01-01T01:00:00+01:00"),
        repeat: checked,
      };
      addDoc(newSubcollectionRef, newDocumentData);
      currentDate.setDate(currentDate.getDate() + 7);
    }
    alert(`Wöchentliche Aufgaben erfolgreich hinzugefügt!`);
    window.location.href = "/adminroom?tab=aufgaben-tab";
  }
  if (checked == "monatlich") {
    var currentDate = new Date(time_task);
    const endDate = new Date(time_end);
    while (currentDate <= endDate) {
      const newDocumentData = {
        assignee: mitarbeiterOption,
        description: beschreibung_task,
        title: titel_task,
        issued: new Date(currentDate),
        building: formatted_gebaude,
        buildingID: house.id,
        done: new Date("2000-01-01T01:00:00+01:00"),
        repeat: checked,
      };
      addDoc(newSubcollectionRef, newDocumentData);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    alert(`Monatliche Aufgaben erfolgreich hinzugefügt!`);
    window.location.href = "/adminroom?tab=aufgaben-tab";
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const adminsRef = collection(db, "Admins");
    getDocs(adminsRef).then((querySnapshot) => {
      querySnapshot.forEach((docx) => {
        if (docx.data().email === user.email) {
          admin_mail=user.email;
          document.getElementById("user_name").innerHTML = docx.data().surname;

          document.getElementById("user_email").innerHTML = docx.data().email;
          companyName = docx.data().company;
          // document.getElementById("firma").innerHTML = docx.data().company;

          const firmaElements = document.querySelectorAll("#firma");
          const newData = docx.data().company;
          firmaElements.forEach(function (element) {
            element.innerHTML = newData;
          });

          // document.getElementById("vornameProfil").innerHTML =
          //   docx.data().surname;
          // document.getElementById("nachnameProfil").innerHTML =
          //   docx.data().name;
          // document.getElementById("emailProfil").innerHTML = docx.data().email;

          document.getElementById("n1").innerHTML = docx.data().surname[0];
          document.getElementById("n2").innerHTML = docx.data().name[0];

          const companiesRef = collection(db, "Companies");
          const companyDoc = doc(companiesRef, docx.data().company);
          const userCollections = collection(companyDoc, "Users");
          const facilityCollections = collection(companyDoc, "Buildings");

          //iteriere durch jede task sortiert nach datum
          const taskCollection = collection(companyDoc, "Tasks");
          getDocs(query(taskCollection, orderBy("issued"))).then(
            (querySnapshot) => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach((taskdoc) => {
                  const time = taskdoc.data().issued;
                  const dateFromTimestamp = new Date(time.seconds * 1000);

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  const taskListDash =
                    document.getElementById("task_list_dash");
                  const taskIssued = new Date(
                    taskdoc.data().issued.seconds * 1000
                  );
                  const formattedDate = `${taskIssued
                    .getDate()
                    .toString()
                    .padStart(2, "0")}.${(taskIssued.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}.${taskIssued.getFullYear()}`;

                  const formattedTime = `${taskIssued
                    .getHours()
                    .toString()
                    .padStart(2, "0")}: ${taskIssued
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")} Uhr`;

                  const taskDone = new Date(taskdoc.data().done.seconds * 1000);
                  const january1st2010 = new Date("2010-01-01T00:00:00Z");

                  //aufgaben tab übersicht
                  const taskListTab = document.getElementById("task_list_tab");
                  const taskListTabWeek =
                    document.getElementById("task_list_tab_week");

                  const htmlGreen = `
                <div class="columns-14 w-row">
                    <div class="column-23 w-col w-col-2">
                        <div class="text-block-19-copy-copy-copy">${
                          taskdoc.data().title
                        }</div>
                        <div class="text-block-19-copy-copy">${
                          taskdoc.data().building
                        }</div>
                    </div>
                    <div class="w-col w-col-3">
                        <div class="text-block-19-desc">${
                          taskdoc.data().description
                        }</div>
                    </div>
                    <div class="column-24 w-col w-col-2">
                        <div class="text-block-19-copy-copy">${
                          taskdoc.data().assignee
                        }</div>
                    </div>
                    <div class="column-27 w-col w-col-1">
                        <div class="text-block-19-copy-copy">${
                          taskdoc.data().repeat
                        }</div>
                    </div>
                    <div class="column-29 w-col w-col-2">
                        <div class="text-block-19-copy-copy">${formattedDate},<br>${formattedTime}</div>
                    </div>
                    <div class="column-28 w-col w-col-2">
                        <div class="div-block-green">
                            <div class="text-block-19-copy">
                                <strong class="bold-text-green">fertig</strong>
                            </div>
                        </div>
                        <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" alt="" class="image-8" style="position: absolute; top: 0; right: 0; width: 20px; height: 20px;"> <!-- Hinzufügen von width und height auf 20px -->
          <button id="${
            taskdoc.id
          }" class="deleteTaskButton" style="position: absolute; top: 0; right: 0; width: 20px; height: 20px; border: none; background: transparent;"></button>
                        </div>
                </div><br>`;

                  const htmlOrange = `
                <div class="columns-14 w-row">
                <div class="column-23 w-col w-col-2">
                <div class="text-block-19-copy-copy-copy">${
                  taskdoc.data().title
                }</div>
                <div class="text-block-19-copy-copy">${
                  taskdoc.data().building
                }</div>
                </div>
                <div class="w-col w-col-3">
                <div class="text-block-19-desc">${
                  taskdoc.data().description
                }</div>
                </div>
                <div class="column-24 w-col w-col-2">
                <div class="text-block-19-copy-copy">${
                  taskdoc.data().assignee
                }</div>
                </div><div class="column-27 w-col w-col-1">
                <div class="text-block-19-copy-copy">${
                  taskdoc.data().repeat
                }</div>
                </div>
                <div class="column-29 w-col w-col-2">
                <div class="text-block-19-copy-copy">${formattedDate},<br>${formattedTime}</div>
                </div>
                <div class="column-28 w-col w-col-2"><div class="div-block-orange">
                <div class="text-block-19-copy">
                <strong class="bold-text-orange">offen</strong></div>
                </div>
                <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" alt="" class="image-8" style="position: absolute; top: 0; right: 0; width: 20px; height: 20px;"> <!-- Hinzufügen von width und height auf 20px -->
                <button id="${
                  taskdoc.id
                }" class="deleteTaskButton" style="position: absolute; top: 0; right: 0; width: 20px; height: 20px; border: none; background: transparent;"></button>
                </div>
                </div><br>`;

                  const htmlRed = `
                <div class="columns-14 w-row">
                    <div class="column-23 w-col w-col-2">
                        <div class="text-block-19-copy-copy-copy">${
                          taskdoc.data().title
                        }</div>
                        <div class="text-block-19-copy-copy">${
                          taskdoc.data().building
                        }</div>
                    </div>
                    <div class="w-col w-col-3">
                        <div class="text-block-19-desc">${
                          taskdoc.data().description
                        }</div>
                    </div>
                    <div class="column-24 w-col w-col-2">
                        <div class="text-block-19-copy-copy">${
                          taskdoc.data().assignee
                        }</div>
                    </div>
                    <div class="column-27 w-col w-col-1">
                        <div class="text-block-19-copy-copy">${
                          taskdoc.data().repeat
                        }</div>
                    </div>
                    <div class="column-29 w-col w-col-2">
                        <div class="text-block-19-copy-copy">${formattedDate},<br>${formattedTime}</div>
                    </div>
                    <div class="column-28 w-col w-col-2">
                        <div class="div-block-red">
                            <div class="text-block-19-copy">
                                <strong class="bold-text-red">verpasst</strong>
                            </div>
                        </div>
                        <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" alt="" class="image-8" style="position: absolute; top: 0; right: 0; width: 20px; height: 20px;"> <!-- Hinzufügen von width und height auf 20px -->
        <button id="${
          taskdoc.id
        }" class="deleteTaskButton" style="position: absolute; top: 0; right: 0; width: 20px; height: 20px; border: none; background: transparent;"></button>
                        </div>
                </div><br>`;

                  if (taskDone > january1st2010) {
                    document.getElementById("task_all_none_txt").style.display =
                      "none";
                    //delete no current task text
                    document.getElementById(
                      "task_current_none_txt"
                    ).style.display = "none";
                    taskListTab.innerHTML += htmlGreen;
                    if (
                      Math.abs(new Date() - taskIssued) <=
                      7 * 24 * 60 * 60 * 1000
                    ) {
                      taskListTabWeek.innerHTML += htmlGreen;
                    }
                  } else {
                    document.getElementById("task_all_none_txt").style.display =
                      "none";

                    if ((new Date() - taskIssued) / (1000 * 60 * 60) > 1) {
                      //wenn aufgabe nach einer stunde immernoch nicht bearbeitet wurde
                      taskListTab.innerHTML += htmlRed;
                      if (
                        Math.abs(new Date() - taskIssued) <=
                        7 * 24 * 60 * 60 * 1000
                      ) {
                        taskListTabWeek.innerHTML += htmlRed;
                      }
                    } else {
                      taskListTab.innerHTML += htmlOrange;
                      if (
                        Math.abs(new Date() - taskIssued) <=
                        7 * 24 * 60 * 60 * 1000
                      ) {
                        taskListTabWeek.innerHTML += htmlOrange;
                      }
                    }
                  }

                  //wenn task heute ist zu dahboard hinzufügen
                  if (
                    dateFromTimestamp.toDateString() === today.toDateString()
                  ) {
                    //task none text löschen

                    document.getElementById(
                      "tasks_today_none_txt"
                    ).style.display = "none";

                    if (taskDone > january1st2010) {
                      var task_done_html = `
                      <div class="columns-14 w-row">
                          <div class="column-23 w-col w-col-6">
                              <div class="text-block-19-copy-copy-copy">${
                                taskdoc.data().title
                              }</div>
                              <div class="text-block-19-copy-copy">${
                                taskdoc.data().building
                              }</div>
                          </div>
                          <div class="w-col w-col-3">
                              <div class="text-block-19-copy">${formattedTime}</div>
                          </div>
                          <div class="column-24 w-col w-col-3">
                              <div class="div-block-green">
                                  <div class="text-block-19-copy">
                                      <strong class="bold-text-green">fertig</strong>
                                  </div>
                              </div>
                          </div>
                      </div>`;
                      //task abgehakt
                      //worker_layover_task_today
                      if (
                        !worker_layover_task_today_list.hasOwnProperty(
                          taskdoc.data().assignee
                        )
                      ) {
                        worker_layover_task_today_list[
                          taskdoc.data().assignee
                        ] = [task_done_html];
                      } else {
                        worker_layover_task_today_list[
                          taskdoc.data().assignee
                        ].push(task_done_html);
                      }

                      ///task done count dashboard
                      if (taskDoneCounter[taskdoc.data().assignee]) {
                        taskDoneCounter[taskdoc.data().assignee][0] += 1;
                        taskDoneCounter[taskdoc.data().assignee][1] += 1;
                      } else {
                        taskDoneCounter[taskdoc.data().assignee] = [1, 1];
                      }

                      taskListDash.innerHTML += task_done_html;
                    } else {
                      ///task done count dashboard
                      if (taskDoneCounter[taskdoc.data().assignee]) {
                        taskDoneCounter[taskdoc.data().assignee][0] += 0;
                        taskDoneCounter[taskdoc.data().assignee][1] += 1;
                      } else {
                        taskDoneCounter[taskdoc.data().assignee] = [0, 1];
                      }
                      if ((new Date() - taskIssued) / (1000 * 60 * 60) > 1) {
                        //wenn aufgabe nach einer stunde immernoch nicht bearbeitet wurde
                        var task_lost_html = `
                        <div class="columns-14 w-row">
                            <div class="column-23 w-col w-col-6">
                                <div class="text-block-19-copy-copy-copy">${
                                  taskdoc.data().title
                                }</div>
                                <div class="text-block-19-copy-copy">${
                                  taskdoc.data().building
                                }</div>
                            </div>
                            <div class="w-col w-col-3">
                                <div id="tasks_done_counter" class="text-block-19-copy">${formattedTime}</div>
                            </div>
                            <div class="column-24 w-col w-col-3">
                                <div class="div-block-red">
                                    <div class="text-block-19-copy">
                                        <strong class="bold-text-red">verpasst</strong>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        taskListDash.innerHTML += task_lost_html;

                        //worker_layover_task_today
                        if (
                          !worker_layover_task_today_list.hasOwnProperty(
                            taskdoc.data().assignee
                          )
                        ) {
                          worker_layover_task_today_list[
                            taskdoc.data().assignee
                          ] = [task_lost_html];
                        } else {
                          worker_layover_task_today_list[
                            taskdoc.data().assignee
                          ].push(task_lost_html);
                        }
                      } else {
                        var task_open_html = `
                        <div class="columns-14 w-row">
                            <div class="column-23 w-col w-col-6">
                                <div class="text-block-19-copy-copy-copy">${
                                  taskdoc.data().title
                                }</div>
                                <div class="text-block-19-copy-copy">${
                                  taskdoc.data().building
                                }</div>
                            </div>
                            <div class="w-col w-col-3">
                                <div id="tasks_done_counter" class="text-block-19-copy">${formattedTime}</div>
                            </div>
                            <div class="column-24 w-col w-col-3">
                                <div class="div-block-orange">
                                    <div class="text-block-19-copy">
                                        <strong class="bold-text-orange">offen</strong>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        taskListDash.innerHTML += task_open_html;

                        //worker_layover_task_today
                        if (
                          !worker_layover_task_today_list.hasOwnProperty(
                            taskdoc.data().assignee
                          )
                        ) {
                          worker_layover_task_today_list[
                            taskdoc.data().assignee
                          ] = [task_open_html];
                        } else {
                          worker_layover_task_today_list[
                            taskdoc.data().assignee
                          ].push(task_open_html);
                        }
                      }
                    }
                  }

                  //random color for calendar
                  const { bgColor, textColor } = getRandomColor(
                    taskdoc.data().assignee
                  );

                  newEvents[taskdoc.id] = {
                    worker: taskdoc.data().assignee,
                    title: taskdoc.data().title,
                    description: taskdoc.data().description,
                    start: taskdoc.data().issued,
                    end: taskdoc.data().issued,
                    repeat: taskdoc.data().repeat,
                    done: taskdoc.data().done,
                    building: taskdoc.data().building,
                    buildingID: taskdoc.data().buildingID,
                    backgroudColor: bgColor,
                    textColor: textColor,
                  };
                });

                const deleteTaskButtons =
                  document.querySelectorAll(".deleteTaskButton");
                deleteTaskButtons.forEach((button) => {
                  button.addEventListener("click", function () {
                    const taskId = button.id;

                    const confirmDelete = confirm(
                      "Möchten Sie diese Aufgabe wirklich löschen?"
                    );

                    if (confirmDelete) {
                      deleteDocumentFromFirestore(taskId, taskCollection);
                    }
                  });
                });

                // renderCalendar(newEvents);
              }
            }
          );

          getDocs(facilityCollections).then((querySnapshot) => {
            // const userList = document.querySelector("#facilityList");
            var once = true;
            var buttonContainer = document.getElementById("button-container");
            // var facility_dropdown =
            //   document.getElementById("facility_dropdown");
            querySnapshot.forEach((docz) => {
              //facillity list for dropdown

              var dd_child = getFacilityChild(docz);
              facility_dropdown.innerHTML += dd_child;

              //delete no facility text
              document.getElementById("geb_tab_none_txt").style.display =
                "none";

              //gebaude options vor a form
              var opt3 = document.createElement("option");
              const addressString =
                docz.data().address +
                ", " +
                docz.data().zipcode +
                " " +
                docz.data().city;

              opt3.text = addressString;
              gebaude_List.appendChild(opt3);

              const subDictionary = {
                address: docz.data().address,
                zipcode: docz.data().zipcode,
                city: docz.data().city,
                id: docz.id,
              };

              gebaudeDictionary[addressString] = subDictionary;

              var button = document.createElement("button");
              button.textContent =
                docz.data().address +
                ", " +
                docz.data().zipcode +
                " " +
                docz.data().city +
                "  ";
              const filePath =
                docx.data().company +
                "/" +
                docz.data().address +
                ", (" +
                docz.data().zipcode +
                ")/Calendar";

              //base path für alle dateien

              const basePath =
                docx.data().company +
                "/" +
                docz.data().address +
                ", (" +
                docz.data().zipcode +
                ")";

              var baseRef = ref(storage, basePath);

              listAll(baseRef)
                .then((result) => {
                  result.prefixes.forEach((folderRef) => {
                    // Um nur den Namen des Ordners zu erhalten, extrahieren Sie ihn aus dem fullPath
                    // const folderName = folderRef.fullPath.split('/').pop();
                    const folderPathSegments = folderRef.fullPath.split("/");
                    const folderName =
                      folderPathSegments[folderPathSegments.length - 1];

                    const forbidden_folders = [
                      "Information",
                      "Calendar",
                      "Evidence",
                      "counterelectricity",
                      "countergas",
                      "counterwater",
                    ];
                    if (!forbidden_folders.includes(folderName)) {
                      //add map key values to list pdfs in folder

                      const filePathFolder =
                        docx.data().company +
                        "/" +
                        docz.data().address +
                        ", (" +
                        docz.data().zipcode +
                        ")/" +
                        folderName;

                      var filesRef = ref(storage, filePathFolder);

                      listAll(filesRef)
                        .then((result) => {
                          result.items.forEach((pdfRef) => {
                            const pdfName = pdfRef.name;

                            // Überprüfen, ob der Dateiname nicht mit ".placeholder" endet
                            if (!pdfName.endsWith(".placeholder")) {
                              getDownloadURL(pdfRef)
                                .then((url) => {
                                  const innerHtmlPdf =  `<div  class="div-block-39">
                                  <a href="${url}" target="_blank" class="filename">
                                  <div class="div-block-35">
                                  <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/664f6e03f96e15b4d3554801_Order.png"
                                   loading="lazy" alt=""><div class="text-block-19-pdf">${pdfName}</div>
                                   </div></a>
                                   <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" loading="lazy" 
                                   alt="" class="image-12 trash-icon-files"></div>`;
                             


                                                       
                                  const map_key =
                                    docz.data().address +
                                    docz.data().zipcode +
                                    folderName;
                                  if (geb_pdf_map.hasOwnProperty(map_key)) {
                                    geb_pdf_map[map_key].push(innerHtmlPdf);
                                  } else {
                                    geb_pdf_map[map_key] = [innerHtmlPdf];
                                  }
                                })
                                .catch((error) => {
                                  console.error(
                                    "Fehler beim Abrufen des Download-URLs:",
                                    error
                                  );
                                });
                            }
                          });
                        })
                        .catch((error) => {
                          console.error(
                            "Fehler beim Auflisten der PDF-Dateien:",
                            error
                          );
                        });

          
                      const id = encodeURIComponent(folderName);

                      const innerHTMLFolders = `<div class="folder_button" id=${id}>
                          <div class="div-block-35">
                          <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/664f6f7f337551434c3c3751_Book_fill.png" loading="lazy" alt="">
                          <div class="text-block-19-pdf">${folderName}</div></div>
                          <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/63ef532ba90a073195f4a6b6_Arrow%20Right.svg" loading="lazy" 
                          alt="" class="image-12"></div>`;
                

                      const map_key = docz.data().address + docz.data().zipcode;
                      if (geb_pdf_map.hasOwnProperty(map_key)) {
                        geb_pdf_map[map_key].push(innerHTMLFolders);
                      } else {
                        geb_pdf_map[map_key] = [innerHTMLFolders];
                      }
                    }
                  });
                })
                .catch((error) => {
                  console.error("Fehler beim Auflisten der Ordner:", error);
                });

              //list all folders except Calendar, Evidence, Information, counterelectricity, countergas

              //images for gebäude layover
              const filePathImages =
                docx.data().company +
                "/" +
                docz.data().address +
                ", (" +
                docz.data().zipcode +
                ")/Evidence";

              // const filePathPdf =
              //   docx.data().company +
              //   "/" +
              //   docz.data().address +
              //   ", (" +
              //   docz.data().zipcode +
              //   ")/PDFs";

              // var pdfsRef = ref(storage, filePathPdf);

              // listAll(pdfsRef)
              //   .then((result) => {
              //     result.items.forEach((pdfRef) => {

              //       const pdfName = pdfRef.name;

              //       getDownloadURL(pdfRef)
              //         .then((url) => {
              //           const innerHtmlPdf = `<a href="${url}" target="_blank" class="w-inline-block">
              //                                 <div class="div-block-34-copy">
              //                                   <div class="text-block-19-pdf">${pdfName}</div>
              //                                   <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/63ef532ba90a073195f4a6b6_Arrow%20Right.svg" loading="lazy" alt="" class="image-12">
              //                                 </div>
              //                               </a>`;

              //           const map_key =
              //             docz.data().address + docz.data().zipcode;
              //           if (geb_pdf_map.hasOwnProperty(map_key)) {
              //             geb_pdf_map[map_key].push(innerHtmlPdf);
              //           } else {
              //             geb_pdf_map[map_key] = [innerHtmlPdf];
              //           }
              //         })
              //         .catch((error) => {
              //           console.error(
              //             "Fehler beim Abrufen des Download-URLs:",
              //             error
              //           );
              //         });
              //     });
              //   })
              //   .catch((error) => {
              //     console.error(
              //       "Fehler beim Auflisten der PDF-Dateien:",
              //       error
              //     );
              //   });

              var imagesRef = ref(storage, filePathImages); //storageRef.child(filePathImages);

              listAll(imagesRef)
                .then((result) => {
                  result.items.forEach((imageRef) => {
                    getDownloadURL(imageRef)
                      .then((url) => {
                        const map_key =
                          docz.data().address + docz.data().zipcode;
                        if (geb_image_map.hasOwnProperty(map_key)) {
                          geb_image_map[map_key].push(url);
                        } else {
                          geb_image_map[map_key] = [url];
                        }
                      })
                      .catch((error) => {});
                  });
                })
                .catch((error) => {});

              const filePathImagesInfo =
                docx.data().company +
                "/" +
                docz.data().address +
                ", (" +
                docz.data().zipcode +
                ")/Information";

              var imagesRef = ref(storage, filePathImagesInfo); //storageRef.child(filePathImages);

              listAll(imagesRef)
                .then((result) => {
                  result.items.forEach((imageRef) => {
                    getDownloadURL(imageRef)
                      .then((url) => {
                        const map_key =
                          docz.data().address + docz.data().zipcode;
                        if (geb_image_map_info.hasOwnProperty(map_key)) {
                          geb_image_map_info[map_key].push(url);
                        } else {
                          geb_image_map_info[map_key] = [url];
                        }
                      })
                      .catch((error) => {});
                  });
                })
                .catch((error) => {});

              var fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = ".ics";

              const label = document.createElement("label");
              const label2 = document.createElement("label");

              getFirstFileNameInFolder(filePath)
                .then(({ fileName, modifiedDate }) => {
                  if (fileName) {
                    label.textContent = fileName;
                    label2.textContent = "  Vom: " + modifiedDate;
                  } else {
                    label.textContent = "Kein Abfuhrplan hochgeladen.";
                  }
                })
                .catch((error) => {
                  label.textContent = "Kein Abfuhrplan hochgeladen.";
                });
              fileInput.addEventListener("change", function () {
                var file = fileInput.files[0];
                if (file.type !== "text/calendar") {
                  alert("Bitte laden Sie nur .ics-Dateien hoch!");
                  fileInput.value = "";
                } else {
                  try {
                    getFirstFileNameInFolder(filePath).then(
                      ({ fileName, modifiedDate }) => {
                        if (fileName) {
                          const desertRef = ref(
                            storage,
                            filePath + "/" + fileName
                          );
                          deleteObject(desertRef).then(() => {});
                        }
                      }
                    );

                    const storageRef = ref(storage, filePath + "/" + file.name);
                    uploadBytes(storageRef, file);
                    location.reload();
                  } catch (error) {}
                }
              });

              const inputWrapper = document.createElement("div");
              inputWrapper.classList.add("input-wrapper");
              inputWrapper.appendChild(fileInput);
              inputWrapper.appendChild(label);
              inputWrapper.appendChild(label2);
              button.appendChild(inputWrapper);

              var userInput = document.createElement("select");
              var defaultOption = document.createElement("option");

              defaultOption.text = "Mitarbeiter auswählen";
              defaultOption.disabled = true;
              defaultOption.selected = true;
              const accessCollection = collection(companyDoc, "Accesses");
              getDocs(accessCollection).then((querySnapshot) => {
                const firstDocument = querySnapshot.docs[0];
                const existingData = firstDocument.data();
                const address = `${docz.data().address}, (${
                  docz.data().zipcode
                })`;
                if (!querySnapshot.empty) {
                  if (existingData.employeeCalendar[address] != undefined) {
                    defaultOption.text = existingData.employeeCalendar[address];
                  }
                }
              });
              userInput.appendChild(defaultOption);

              getDocs(userCollections)
                .then((querySnapshot) => {
                  querySnapshot.forEach((docUsers) => {
                    var opt = document.createElement("option");
                    opt.text = docUsers.data().email;
                    userInput.appendChild(opt);

                    if (once) {
                      var opt2 = document.createElement("option");
                      opt2.text = docUsers.data().email;
                      var opt3 = document.createElement("option");
                      opt3.text = docUsers.data().email;

                      mitarbeiter_Calender_Select.appendChild(opt2);
                      mitarbeiter_List.appendChild(opt3);
                    }

                    // mitarbeiter_List.appendChild(opt);
                  });
                })
                .catch((error) => {})
                .finally(() => (once = false));

              userInput.addEventListener("change", function () {
                var selectedOption =
                  userInput.options[userInput.selectedIndex].value;
                getDocs(accessCollection).then((querySnapshot) => {
                  const firstDocument = querySnapshot.docs[0];
                  const existingData = firstDocument.data();
                  const address = `${docz.data().address}, (${
                    docz.data().zipcode
                  })`;
                  if (!querySnapshot.empty) {
                    const newData = {
                      ...existingData,
                      employeeCalendar: {
                        ...existingData.employeeCalendar,
                        [address]: selectedOption,
                      },
                    };
                    updateDoc(firstDocument.ref, newData).then(
                      (firstDocument) => {}
                    );
                  } else {
                  }
                });
              });

              document.getElementById("abf_none_txt").style.display = "none";

              button.appendChild(userInput);
              buttonContainer.appendChild(button);
              // gebäude list item
              // const listItem = document.createElement("li");
              // listItem.textContent =
              //   docz.data().address +
              //   ", " +
              //   docz.data().zipcode +
              //   " " +
              //   docz.data().city;
              // userList.appendChild(listItem);
            });

            //add event listener to buttons
            // Finde alle Buttons mit der Klasse "link-block w-inline-block"

            var buttons_geblayover = document.querySelectorAll(
              ".link-block.w-inline-block"
            );

            // Iteriere über alle gefundenen Buttons und füge den Eventlistener hinzu
            buttons_geblayover.forEach(function (button) {
              button.addEventListener("click", function () {
                // Mache das Div mit der ID "geb_layover" sichtbar
                var gebLayover = document.getElementById("geb_layover");

                gebLayover.style.display = "flex";

                /// Hier auf die Firestore-Daten zugreifen und in die Konsole drucken
                const facilityCollections = collection(companyDoc, "Buildings");
                getDoc(doc(facilityCollections, button.id))
                  .then((docSnapshot) => {
                    if (docSnapshot.exists()) {
                      var dataG = docSnapshot.data();
                      const map_key = dataG.address + dataG.zipcode;

                      //pdfs
                      const pdfListDiv = document.getElementById("pdf_list");
                      const no_txt = document.getElementById(
                        "data_upload_none_txt"
                      );

                      if (geb_pdf_map.hasOwnProperty(map_key)) {
                        no_txt.style.display = "none";
                        geb_pdf_map[map_key].forEach((pdf_html) => {
                          pdfListDiv.innerHTML += pdf_html;
                        });
                      } else {
                        no_txt.style.display = "block";
                      }

                      //change gas

                      const changeGasElement =
                        document.getElementById("change_gas");

                      // Die Funktion, die dem Event-Listener zugewiesen wurde
                      function changeGasEventHandler() {
                        var newGas = prompt(
                          "Gib einen neuen Wert für den Gaszählerstand ein:"
                        );
                        if (newGas !== null) {
                          // Überprüfen, ob nur Zahlen eingegeben wurden
                          if (/^\d+$/.test(newGas)) {
                            document.getElementById("counter_gas").innerHTML =
                              newGas;

                            const updatedData = {
                              ...dataG,
                              countergas: newGas,
                            };
                            updateDoc(
                              doc(facilityCollections, button.id),
                              updatedData
                            )
                              .then(() => {
                                console.log(
                                  "Dokument erfolgreich aktualisiert."
                                );
                              })
                              .catch((error) => {
                                console.error(
                                  "Fehler beim Aktualisieren des Dokuments:",
                                  error
                                );
                              });
                          } else {
                            alert("Bitte gib nur Zahlen ein.");
                          }
                          // Entfernen des Event-Listeners nach dem ersten Aufruf
                          changeGasElement.removeEventListener(
                            "click",
                            changeGasEventHandler
                          );
                        }
                      }

                      // Event-Listener hinzufügen
                      changeGasElement.addEventListener(
                        "click",
                        changeGasEventHandler
                      );

                      // Event-Listener entfernen

                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          // Entfernen des Event-Listeners
                          changeGasElement.removeEventListener(
                            "click",
                            changeGasEventHandler
                          );
                        });

                      //change water
                      const changeWaterElement =
                        document.getElementById("change_wasser");

                      // Die Funktion, die dem Event-Listener zugewiesen wurde
                      function changeWaterEventHandler() {
                        var newWater = prompt(
                          "Gib einen neuen Wert für den Wasserzählerstand ein:"
                        );
                        if (newWater !== null) {
                          // Überprüfen, ob nur Zahlen eingegeben wurden
                          if (/^\d+$/.test(newWater)) {
                            document.getElementById(
                              "counter_wasser"
                            ).innerHTML = newWater;

                            const updatedData = {
                              ...dataG,
                              counterwater: newWater,
                            };
                            updateDoc(
                              doc(facilityCollections, button.id),
                              updatedData
                            )
                              .then(() => {
                                console.log(
                                  "Dokument erfolgreich aktualisiert."
                                );
                              })
                              .catch((error) => {
                                console.error(
                                  "Fehler beim Aktualisieren des Dokuments:",
                                  error
                                );
                              });
                          } else {
                            alert("Bitte gib nur Zahlen ein.");
                          }
                          // Entfernen des Event-Listeners nach dem ersten Aufruf
                          changeWaterElement.removeEventListener(
                            "click",
                            changeWaterEventHandler
                          );
                        }
                      }

                      // Event-Listener hinzufügen
                      changeWaterElement.addEventListener(
                        "click",
                        changeWaterEventHandler
                      );

                      // Event-Listener entfernen

                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          // Entfernen des Event-Listeners
                          changeWaterElement.removeEventListener(
                            "click",
                            changeWaterEventHandler
                          );
                        });

                      //change strom

                      const changeStromElement =
                        document.getElementById("change_strom");

                      function changeStromEventHandler() {
                        var newStrom = prompt(
                          "Gib einen neuen Wert für den Stromzählerstand ein:"
                        );
                        if (newStrom !== null) {
                          // Überprüfen, ob nur Zahlen eingegeben wurden
                          if (/^\d+$/.test(newStrom)) {
                            document.getElementById("counter_strom").innerHTML =
                              newStrom;

                            const updatedData = {
                              ...dataG,
                              counterelectricity: newStrom,
                            };
                            updateDoc(
                              doc(facilityCollections, button.id),
                              updatedData
                            )
                              .then(() => {
                                console.log(
                                  "Dokument erfolgreich aktualisiert."
                                );
                              })
                              .catch((error) => {
                                console.error(
                                  "Fehler beim Aktualisieren des Dokuments:",
                                  error
                                );
                              });
                          } else {
                            alert("Bitte gib nur Zahlen ein.");
                          }
                          // Entfernen des Event-Listeners nach dem ersten Aufruf
                          changeStromElement.removeEventListener(
                            "click",
                            changeStromEventHandler
                          );
                        }
                      }

                      changeStromElement.addEventListener(
                        "click",
                        changeStromEventHandler
                      );

                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          changeStromElement.removeEventListener(
                            "click",
                            changeStromEventHandler
                          );
                        });

                      //change name

                      const changeNameElement =
                        document.getElementById("change_name");

                      function changeNameEventHandler() {
                        var newName = prompt("Gib einen neuen Namen ein:");
                        if (newName !== null) {
                          document.getElementById("kunde_name").innerHTML =
                            newName;

                          const updatedData = { ...dataG, owner: newName };
                          updateDoc(
                            doc(facilityCollections, button.id),
                            updatedData
                          )
                            .then(() => {
                              console.log("Dokument erfolgreich aktualisiert.");
                            })
                            .catch((error) => {
                              console.error(
                                "Fehler beim Aktualisieren des Dokuments:",
                                error
                              );
                            });
                          // Entfernen des Event-Listeners nach dem ersten Aufruf
                          changeNameElement.removeEventListener(
                            "click",
                            changeNameEventHandler
                          );
                        }
                      }

                      // Event-Listener hinzufügen
                      changeNameElement.addEventListener(
                        "click",
                        changeNameEventHandler
                      );

                      // Event-Listener entfernen
                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          // Entfernen des Event-Listeners
                          changeNameElement.removeEventListener(
                            "click",
                            changeNameEventHandler
                          );
                        });

                      //change tel

                      const changeTelElement =
                        document.getElementById("change_tel");

                      // Die Funktion, die dem Event-Listener zugewiesen wurde
                      function changeTelEventHandler() {
                        var newTel = prompt(
                          "Gib eine neue Telefonnummer für den Kunden ein:",
                          ""
                        );
                        if (newTel !== null) {
                          // Überprüfen, ob nur Zahlen eingegeben wurden
                          if (/^\d+$/.test(newTel)) {
                            // Setzen Sie den href direkt auf die Telefonnummer
                            document.getElementById(
                              "kunde_tel"
                            ).innerHTML = `<a href="tel:${newTel}">${newTel}</a>`;

                            const updatedData = { ...dataG, phone: newTel }; // Ersetzen Sie "neuer Besitzer" durch den neuen Besitzerwert
                            // Update des Dokuments in der Firestore-Datenbank
                            updateDoc(
                              doc(facilityCollections, button.id),
                              updatedData
                            )
                              .then(() => {
                                console.log(
                                  "Dokument erfolgreich aktualisiert."
                                );
                              })
                              .catch((error) => {
                                console.error(
                                  "Fehler beim Aktualisieren des Dokuments:",
                                  error
                                );
                              });
                            // Entfernen des Event-Listeners nach dem ersten Aufruf
                            changeTelElement.removeEventListener(
                              "click",
                              changeTelEventHandler
                            );
                          } else {
                            alert(
                              "Bitte gib nur Zahlen als Telefonnummer ein."
                            );
                          }
                        }
                      }

                      // Event-Listener hinzufügen
                      changeTelElement.addEventListener(
                        "click",
                        changeTelEventHandler
                      );

                      // Event-Listener entfernen
                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          // Entfernen des Event-Listeners
                          changeTelElement.removeEventListener(
                            "click",
                            changeTelEventHandler
                          );
                        });

                      //change mail

                      const changeMailElement =
                        document.getElementById("change_mail");

                      function changeMailEventHandler() {
                        var newMail = prompt(
                          "Gib eine neue E-Mail-Adresse für den Kunden ein:",
                          ""
                        );
                        if (newMail !== null) {
                          if (/^\S+@\S+\.\S+$/.test(newMail)) {
                            document.getElementById(
                              "kunde_mail"
                            ).innerHTML = `<a href="mailto:${newMail}">${newMail}</a>`;

                            const updatedData = { ...dataG, mail: newMail };
                            updateDoc(
                              doc(facilityCollections, button.id),
                              updatedData
                            )
                              .then(() => {
                                console.log(
                                  "Dokument erfolgreich aktualisiert."
                                );
                              })
                              .catch((error) => {
                                console.error(
                                  "Fehler beim Aktualisieren des Dokuments:",
                                  error
                                );
                              });
                            changeMailElement.removeEventListener(
                              "click",
                              changeMailEventHandler
                            );
                          } else {
                            alert("Gib bitte eine gültige E-Mail-Adresse ein.");
                          }
                        }
                      }

                      changeMailElement.addEventListener(
                        "click",
                        changeMailEventHandler
                      );

                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          changeMailElement.removeEventListener(
                            "click",
                            changeMailEventHandler
                          );
                        });

                        const add_info = document.getElementById("add_info");

                          function handleClick(event) {
                            // Bezeichnung abfragen
                            const bezeichnung = prompt("Was ist die Bezeichnung der Information?");
                            
                            // String für das neue Key-Value-Paar erstellen
                            const keyValueString = `["${bezeichnung}", " - "]`;

                            // Daten aktualisieren und in die Datenbank schreiben
                            const updatedInformation = JSON.parse(dataG.information);
                            updatedInformation.push(JSON.parse(keyValueString));

                            const updatedData = { ...dataG, information: JSON.stringify(updatedInformation) };
                            updateDoc(doc(facilityCollections, button.id), updatedData)
                              .then(() => {

                                document.getElementById("info_div").innerHTML+=`<div class="div-block-34">
                                <div class="text-block-19">${bezeichnung}</div><div class="div-block-38">
                                <div class="text-block-19">-</div>
                                <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/664c6725c4bb3456aa3a7ce4_Edit_fill.png" loading="lazy" alt="" class="image-13">
                                <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" loading="lazy" alt="" class="image-13">
                                </div>
                                </div>`;

                                document.querySelectorAll(".change_value").forEach(element => {
                                  element.addEventListener("click", changeValueEventHandler);
                                });
                                
                          
                              })
                              .catch((error) => {
                                console.error("Fehler beim Aktualisieren der Information:", error);
                              });
                          }

                          // Event-Listener hinzufügen
                          add_info.addEventListener("click", handleClick);

                          // Event-Listener entfernen, wenn "geb_back" gedrückt wird
                          document.getElementById("geb_back").addEventListener("click", function () {
                            add_info.removeEventListener("click", handleClick);
                            document.getElementById("info_div").innerHTML = "";

                          });



                        

                        const info_div=document.getElementById("info_div");

// Parse den String in ein JavaScript-Array
const informationArray = JSON.parse(dataG.information);
for (const info of informationArray) {
  if (info.length > 0) {
    const key = info[0];
    const value = info[1];
    var info_html=`<div class="div-block-34">
    <div class="text-block-19">${key}</div><div class="div-block-38">
    <div class="text-block-19">${value}</div>
    <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/664c6725c4bb3456aa3a7ce4_Edit_fill.png" loading="lazy" alt="" class="image-13 change_value">
    <img src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" loading="lazy" alt="" class="image-13">
    </div>
    </div>`;

    info_div.innerHTML+=info_html;

  }
}



function changeValueEventHandler(event) {
  const element = event.target;
  const key = element.closest(".div-block-34").querySelector(".text-block-19").innerText;
  const newValue = prompt("Neuen Wert eingeben:");
  console.log("Key:", key, "Neuer Wert:", newValue);
}

document.querySelectorAll(".change_value").forEach(element => {
  element.addEventListener("click", changeValueEventHandler);
});

document.getElementById("geb_back").addEventListener("click", function() {
  document.querySelectorAll(".change_value").forEach(element => {
    element.removeEventListener("click", changeValueEventHandler);
  });
});



                      //add folder upload here
                     
                      const add_folder_bttn = document.getElementById("add_folder");

                          function addFolderButtonClickHandler() {
                            var folderName = prompt("Geben Sie einen Namen für den neuen Ordner ein:");
                            if (folderName) {
                              var folderPath =
                                companyName +
                                "/" +
                                dataG.address +
                                ", (" +
                                dataG.zipcode +
                                ")/" +
                                folderName;

                              const map_key = dataG.address + dataG.zipcode + folderName;
                              if (geb_pdf_map.hasOwnProperty(map_key)) {
                                alert("Ordnername existiert bereits! Wähle einen anderen Namen");
                              } else {
                                const emptyData = new Uint8Array(0); 
                                const placeholderFileName = ".placeholder";

                                const fileRef = ref(storage, folderPath + "/" + placeholderFileName); 
                                uploadBytes(fileRef, emptyData)
                                  .then(() => {
                                    alert(`Ordner ${folderName} wurde erfolgreich erstellt.`);

                                    window.location.href = "/adminroom?tab=gebaude-tab";
                                  })
                                  .catch((error) => {});
                              }
                            }
                          }

                          // Event-Listener hinzufügen
                          add_folder_bttn.addEventListener("click", addFolderButtonClickHandler);

                          // Event-Listener entfernen
                          const gebBackElement = document.getElementById("geb_back");
                          gebBackElement.addEventListener("click", function () {
                            // Entfernen des Event-Listeners
                            add_folder_bttn.removeEventListener("click", addFolderButtonClickHandler);
                          });


                      const myID = button.id;

                      //add event listeners to folders, here they are already rendered

                      var buttons_folderlayover =
                        document.querySelectorAll(".folder_button");

                      // Iteriere über alle gefundenen Buttons und füge den Eventlistener hinzu
                      buttons_folderlayover.forEach(function (button) {
                        button.addEventListener("click", function () {
                          // Mache das Div mit der ID "geb_layover" sichtbar
                          var gebLayover =
                            document.getElementById("folder_box");

                          var folderID = button.getAttribute("id");
                          const originalFolderName =
                            decodeURIComponent(folderID);

                          gebLayover.style.display = "flex";

                          document.getElementById(
                            "folder_name_layover"
                          ).innerHTML = originalFolderName;

                          const filesList =
                            document.getElementById("files_list");
                          const file_no_txt =
                            document.getElementById("file_none_txt");

                          const map_key_files =
                            dataG.address + dataG.zipcode + originalFolderName;
                          if (geb_pdf_map.hasOwnProperty(map_key_files)) {
                            file_no_txt.style.display = "none";
                            geb_pdf_map[map_key_files].forEach((pdf_html) => {
                              filesList.innerHTML += pdf_html;
                            });
                          } else {
                            file_no_txt.style.display = "block";
                          }

                          //event listener on trash icon buttons

                           function createTrashIconEventHandler(icon) {
                            return function() {
                              const fileDiv = icon.closest('.div-block-39');
                              if (fileDiv) {
                                const confirmation = confirm("Möchtest du die Datei wirklich löschen?");
                                if (!confirmation) {
                                  return; 
                                }
                                fileDiv.classList.add('invisible');
                              }
                              const filenameElement = fileDiv.querySelector('.text-block-19-pdf'); 
                              if (filenameElement) {
                                const filename = filenameElement.innerText;
                                const filePath = companyName + "/" + dataG.address + ", (" + dataG.zipcode + ")/" + originalFolderName + "/" + filename;
                                const storageRef = ref(storage, filePath);
      deleteObject(storageRef)
        .then(() => {
        })
        .catch((error) => {
          console.error("Fehler beim Löschen der Datei:", error);
        });
                                // deleteFile(filename); // Funktion zum Löschen der Datei in Firestore aufrufen
                              }
                            };
                          }
                          
                          

                              // Hinzufügen des Event-Listeners für jede Trash-Icon-Datei
                              const trashIcons = document.querySelectorAll('.trash-icon-files');
                              trashIcons.forEach(icon => {
                                const trashIconEventHandler = createTrashIconEventHandler(icon);
                                icon.addEventListener('click', trashIconEventHandler);
                              });

                              // Event-Handler für das Drücken des "folder_back"-Buttons
                              document.getElementById("folder_back").addEventListener("click", function () {
                                // Entfernen aller Event-Listener für die Trash-Icon-Dateien
                                trashIcons.forEach(icon => {
                                  const trashIconEventHandler = createTrashIconEventHandler(icon);
                                  icon.removeEventListener('click', trashIconEventHandler);
                                });
                              });

                            
                              
                              
                              // Event-Handler für das Drücken des "folder_back"-Buttons
                              document.getElementById("folder_back").addEventListener("click", function () {
                                // Entfernen aller Event-Listener für die Trash-Icon-Dateien
                                trashIcons.forEach(icon => {
                                  const trashIconEventHandler = createTrashIconEventHandler(icon);
                                  icon.removeEventListener('click', trashIconEventHandler);
                                });
                              });
                              




                          var clickHandlerFDel = function () {
                            const confirmation = confirm(
                              "Bist du sicher, dass du den Ordner löschen willst? Er kann im Nachhinein nicht mehr wiederhergestellt werden."
                            );

                            if (confirmation) {
                              // const del_path =
                              //   "/" +
                              //   companyName +
                              //   "/" +
                              //   dataG.address +
                              //   ", (" +
                              //   dataG.zipcode +
                              //   ")/" +
                              //   originalFolderName +
                              //   "/";

                              // const folderRef = ref(storage, del_path);
                              const directoryName= dataG.address +
                              ", (" +
                              dataG.zipcode +
                              ")/" +
                              originalFolderName

                              

                              const requestBody = {
                                directory: directoryName,
                                company: companyName,
                                email: admin_mail,

                              ////
                              };

                              console.log(admin_mail, companyName, directoryName);
                            
                              fetch("https://haushelper-bot-4584298bee33.herokuapp.com/delete_directory", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(requestBody),
                              })
                                .then((response) => {
                                  if (response.ok) {
                                        alert(`Ordner erfolgreich gelöscht!`);
                                        window.location.href = "/adminroom?tab=gebaude-tab";
                            
                                  } else {
                                    console.error("Fehler beim Registrieren:", response.statusText);
                                  }
                                })
                                .catch((error) => {
                                  console.error("Fehler beim Registrieren:", error);
                                });

                              // Löschen des Ordners
                              // deleteObject(folderRef)
                              //   .then(() => {
                              //     // Fügen Sie hier ggf. weitere Aktionen nach dem Löschen hinzu
                              //   })
                              //   .catch((error) => {
                              //     console.error(
                              //       "Fehler beim Löschen des Ordners:",
                              //       error
                              //     );
                              //     // Hier können Sie Fehlerbehandlung durchführen, z.B. dem Benutzer eine Fehlermeldung anzeigen
                              //   });
                            } else {
                              alert("Das Löschen wurde abgebrochen.");
                            }
                          };

                          var delf_bttn = document.getElementById(
                            "Button_Folder_Delete"
                          );
                          delf_bttn.addEventListener("click", clickHandlerFDel);

                          document
                            .getElementById("folder_back")
                            .addEventListener("click", function () {
                              delf_bttn.removeEventListener(
                                "click",
                                clickHandlerFDel
                              );
                            });

                          var clickHandlerDataUp = function () {
                            getDoc(doc(facilityCollections, myID))
                              .then((docSnapshot) => {
                                if (docSnapshot.exists()) {
                                  const dataG = docSnapshot.data();
                                  const folderPath =
                                    companyName +
                                    "/" +
                                    dataG.address +
                                    ", (" +
                                    dataG.zipcode +
                                    ")/" +
                                    originalFolderName +
                                    "/";

                                  const fileInput =
                                    document.createElement("input");
                                  fileInput.type = "file";
                                  fileInput.accept = ".pdf, .txt"; // Akzeptiere nur .pdf oder .txt Dateien
                                  fileInput.onchange = function (event) {
                                    const file = event.target.files[0];
                                    const fileName = file.name;
                                    const fileExtension = fileName
                                      .split(".")
                                      .pop()
                                      .toLowerCase();

                                    // Überprüfen Sie die Dateierweiterung
                                    if (
                                      !(
                                        fileExtension === "pdf" ||
                                        fileExtension === "txt"
                                      )
                                    ) {
                                      alert(
                                        "Es können nur Dateien im .pdf oder .txt Format hochgeladen werden."
                                      );
                                      return;
                                    }

                                    const fileSize = file.size / (1024 * 1024); // Umrechnung in Megabyte
                                    if (fileSize > 100) {
                                      alert(
                                        "Die Datei ist zu groß. Es sind nur Dateien bis 100 MB zulässig."
                                      );
                                      return;
                                    }
                                    const storageRef = ref(
                                      storage,
                                      folderPath + fileName
                                    );

                                    // Datei hochladen
                                    uploadBytes(storageRef, file)
                                      .then((snapshot) => {
                                        alert(
                                          "Die Datei wurde erfolgreich hochgeladen."
                                        );
                                        window.location.href =
                                          "/adminroom?tab=gebaude-tab";
                                      })
                                      .catch((error) => {
                                        console.error(
                                          "Fehler beim Hochladen der Datei:",
                                          error
                                        );
                                      });
                                  };

                                  fileInput.click();
                                } else {
                                  console.log("Das Dokument existiert nicht.");
                                }
                              })
                              .catch((error) => {
                                console.log(
                                  "Fehler beim Abrufen des Dokuments:",
                                  error
                                );
                              });
                          };

                          var data_up_bttn =
                            document.getElementById("file_upload_bttn");
                          data_up_bttn.addEventListener(
                            "click",
                            clickHandlerDataUp
                          );

                          document
                            .getElementById("folder_back")
                            .addEventListener("click", function () {
                              data_up_bttn.removeEventListener(
                                "click",
                                clickHandlerDataUp
                              );
                            });
                        });
                      });

                      //add images to building layover
                      const gebImagesDiv =
                        document.getElementById("geb_images");
                      const no_image_txt =
                        document.getElementById("images_none_txt");

                      if (geb_image_map.hasOwnProperty(map_key)) {
                        no_image_txt.style.display = "none";

                        geb_image_map[map_key].forEach((image_url) => {
                          // Erstellen des <a>-Elements
                          const imageLink = document.createElement("a");
                          imageLink.href = image_url;
                          imageLink.target = "_blank"; // Öffnen des Links in einem neuen Tab

                          // Erstellen des <img>-Elements
                          const imageElement = document.createElement("img");
                          imageElement.src = image_url;
                          imageElement.style.margin = "5px";
                          imageElement.style.width = "140px";
                          imageElement.style.height = "140px";
                          imageElement.style.objectFit = "cover";

                          // Hinzufügen des <img>-Elements zum <a>-Element
                          imageLink.appendChild(imageElement);

                          // Hinzufügen des <a>-Elements zum gebImagesDiv
                          gebImagesDiv.appendChild(imageLink);
                        });
                      } else {
                        no_image_txt.style.display = "block";
                      }

                      const gebImagesInfoDiv =
                        document.getElementById("geb_images_info");

                      const no_info_image_txt = document.getElementById(
                        "images_info_none_txt"
                      );

                      if (geb_image_map_info.hasOwnProperty(map_key)) {
                        no_info_image_txt.style.display = "none";
                        geb_image_map_info[map_key].forEach((image_url) => {
                          // Erstellen des <a>-Elements
                          const imageLink = document.createElement("a");
                          imageLink.href = image_url;
                          imageLink.target = "_blank"; // Öffnen des Links in einem neuen Tab

                          // Erstellen des <img>-Elements
                          const imageElement = document.createElement("img");
                          imageElement.src = image_url;
                          imageElement.style.margin = "5px";
                          imageElement.style.width = "140px";
                          imageElement.style.height = "140px";
                          imageElement.style.objectFit = "cover";

                          // Hinzufügen des <img>-Elements zum <a>-Element
                          imageLink.appendChild(imageElement);

                          // Hinzufügen des <a>-Elements zum gebImagesDiv
                          gebImagesInfoDiv.appendChild(imageLink);
                        });
                      } else {
                        no_info_image_txt.style.display = "block";
                      }

                      document.getElementById("geb_name_layover").innerHTML =
                        dataG.address + ",";
                      document.getElementById("city_name_layover").innerHTML =
                        dataG.zipcode + " " + dataG.city;
                      document.getElementById("kunde_name").innerHTML =
                        dataG.owner;
                      document.getElementById("counter_wasser").innerHTML =
                        dataG.counterwater;
                      document.getElementById("counter_gas").innerHTML =
                        dataG.countergas;
                      document.getElementById("counter_strom").innerHTML =
                        dataG.counterelectricity;

                      var telefon = dataG.phone;
                      var email = dataG["mail"];

                      var clickHandler = function () {
                        const confirmation = confirm(
                          "Bist du sicher, dass du das Gebäude löschen willst? Es kann im Nachhinein nicht mehr wiederhergestellt werden."
                        );

                        if (confirmation) {
                          const docRef = doc(facilityCollections, button.id);

                          deleteDoc(docRef)
                            .then(() => {
                              alert("Das Gebäude wurde erfolgreich gelöscht.");
                              window.location.reload();
                            })
                            .catch((error) => {
                              alert(
                                "Beim Löschen des Gebäudes ist ein Fehler aufgetreten: " +
                                  error.message
                              );
                            });
                        } else {
                          alert("Das Löschen wurde abgebrochen.");
                        }
                      };

                      var del_bttn =
                        document.getElementById("Button_Geb_Delete");
                      del_bttn.addEventListener("click", clickHandler);

                      document
                        .getElementById("geb_back")
                        .addEventListener("click", function () {
                          del_bttn.removeEventListener("click", clickHandler);
                        });

                     
                      document.getElementById("kunde_tel").innerHTML =
                        "<a href='tel:" + telefon + "'>" + telefon + "</a>";

                      // Formatieren der E-Mail-Adresse als Link
                      document.getElementById("kunde_mail").innerHTML =
                        "<a href='mailto:" + email + "'>" + email + "</a>";
                    } else {
                      console.log("Fehler Dokument ID");
                    }
                  })
                  .catch((error) => {
                    console.error("Fehler beim Abrufen des Dokuments:", error);
                  });
              });
            });
          });

          const companyCollections = collection(companyDoc, "Accesses");
          getDocs(companyCollections).then((querySnapshot) => {
            querySnapshot.forEach((docy) => {
              const dte = new Date(docy.data().canceled * 1000);
              var status = "Aktiv";
              if (dte instanceof Date && !isNaN(dte)) {
                status = "Gekündigt bis zum " + dte.toLocaleString("de-DE");
              }
              // dash
              document.getElementById("status").innerHTML = status;
              // for abo page
              document.getElementById("status2").innerHTML = status;
              // dash
              document.getElementById("abo").innerHTML = docy.data().aboName;
              // for abo page
              document.getElementById("abo2").innerHTML = docy.data().aboName;

              if (docy.data().aboName == "Testpaket") {
                document.getElementById("aboButton").innerHTML = "Upgrade";
                document
                  .getElementById("aboButton")
                  .addEventListener("click", () => {
                    const link = document.getElementById("aboButton");
                    link.href = "https://www.haushelper.de/upgrade-testpaket";
                  });
              }

              document.getElementById("mitarbeiterX").innerHTML =
                docy.data().userAvailable;
              document.getElementById("mitarbeiterY").innerHTML =
                docy.data().userInit;
              // document.getElementById("gebaudeX").innerHTML =
              //   docy.data().facilityAvailable;
              // document.getElementById("gebaudeY").innerHTML =
              //   docy.data().facilityInit;
              const timestamp_purchased = docy.data().purchased;
              const date = new Date(timestamp_purchased.seconds * 1000);
              const dateString = date.toLocaleDateString();
              document.getElementById("date").innerHTML = dateString;
              // abo page
              document.getElementById("date2").innerHTML = dateString;
            });
          });

          var worked_hours = {};
          getDocs(userCollections).then((querySnapshot) => {
            // const userList = document.querySelector("#userList");
            const currentDateString = new Date()
              .toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/\./g, ""); // Aktuelles Datum als String im Format DDMMYYYY

            const workerListDash = document.getElementById("worker_list_dash");

            const mitarbeiterList_main = document.getElementById(
              "mitarbeiter_dropdown"
            );

            querySnapshot.forEach((docw) => {
              //detete no workers text
              document.getElementById("mitarbeiter_none_txt").style.display =
                "none";
              document.getElementById("workers_tab_none_txt").style.display =
                "none";

              var dd_m_child = getWorkerChild(docw);
              mitarbeiterList_main.innerHTML += dd_m_child;

              const htmlCodeOffline = `
            <div class="columns-14 w-row">
                <div class="column-23 w-col w-col-5">
                    <div class="text-block-19-copy-copy">${
                      docw.data().name
                    }</div>
                </div>
                <div class="w-col w-col-4">
                    <div id="tasks_done_counter" class="text-block-19-copy">${
                      taskDoneCounter[docw.data().email]
                        ? taskDoneCounter[docw.data().email][0]
                        : 0
                    } von ${
                taskDoneCounter[docw.data().email]
                  ? taskDoneCounter[docw.data().email][1]
                  : 0
              }</div>
                </div>
                <div class="column-24 w-col w-col-3">
                    <div class="div-block-red">
                        <div class="text-block-19-copy">
                            <strong class="bold-text-red">inaktiv</strong>
                        </div>
                    </div>
                </div>
            </div>`;

              const htmlCodeOnline = `
            <div class="columns-14 w-row">
                <div class="column-23 w-col w-col-5">
                    <div class="text-block-19-copy-copy">${
                      docw.data().name
                    }</div>
                </div>
                <div class="w-col w-col-4">
                    <div id="tasks_done_counter" class="text-block-19-copy">${
                      taskDoneCounter[docw.data().email]
                        ? taskDoneCounter[docw.data().email][0]
                        : 0
                    } von ${
                taskDoneCounter[docw.data().email]
                  ? taskDoneCounter[docw.data().email][1]
                  : 0
              }</div>
                </div>
                <div class="column-24 w-col w-col-3">
                    <div class="div-block-green">
                        <div class="text-block-19-copy">
                            <strong class="bold-text-green">aktiv</strong>
                        </div>
                    </div>
                </div>
            </div>`;

              const timestampsCollectionRef = collection(
                docw.ref,
                "Timestamps"
              );
              getDocs(timestampsCollectionRef)
                .then((timestampsQuerySnapshot) => {
                  if (timestampsQuerySnapshot.empty) {
                    workerListDash.innerHTML += htmlCodeOffline;
                  } else {
                    var active_today = false;

                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayDateString = yesterday
                      .toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      .replace(/\./g, "");

                    const currentDate = new Date(); // Aktuelles Datum und Zeit

                    const currentDayOfWeek = currentDate.getDay();
                    const daysToAdd =
                      currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
                    const currentMonday = new Date(currentDate);
                    currentMonday.setDate(currentDate.getDate() + daysToAdd);

                    const currentSunday = new Date(currentMonday);
                    currentSunday.setDate(currentMonday.getDate() + 6);
                    currentMonday.setHours(0, 0, 0, 0);

                    currentSunday.setHours(0, 0, 0, 0);

                    const currentYear = currentDate.getFullYear();
                    const currentMonth = currentDate.getMonth();

                    const firstDayOfMonth = new Date(
                      currentYear,
                      currentMonth,
                      1
                    );
                    const lastDayOfMonth = new Date(
                      currentYear,
                      currentMonth + 1,
                      0
                    );

                    firstDayOfMonth.setHours(0, 0, 0, 0);

                    lastDayOfMonth.setHours(23, 59, 59, 999);
                    let totalMinutesWorkedInMonth = 0;

                    let totalMinutesWorked = 0;

                    timestampsQuerySnapshot.forEach((timestampDoc) => {
                      const year = parseInt(timestampDoc.id.substring(4, 8));
                      const month =
                        parseInt(timestampDoc.id.substring(2, 4)) - 1;
                      const day = parseInt(timestampDoc.id.substring(0, 2));

                      const timestampDate = new Date(year, month, day);

                      //this month
                      if (
                        timestampDate >= firstDayOfMonth &&
                        timestampDate <= lastDayOfMonth
                      ) {
                        const workStart = timestampDoc.data().Start;
                        const workEnd = timestampDoc.data().End;

                        for (
                          let i = 0;
                          i < Math.min(workStart.length, workEnd.length);
                          i++
                        ) {
                          const [startHours, startMinutes] = workStart[i]
                            .split(":")
                            .map(Number);
                          const [endHours, endMinutes] = workEnd[i]
                            .split(":")
                            .map(Number);

                          const startMinutesSinceMidnight =
                            startHours * 60 + startMinutes;
                          const endMinutesSinceMidnight =
                            endHours * 60 + endMinutes;

                          totalMinutesWorkedInMonth +=
                            endMinutesSinceMidnight - startMinutesSinceMidnight;
                        }
                      }

                      //  date this week
                      if (
                        timestampDate >= currentMonday &&
                        timestampDate <= currentSunday
                      ) {
                        const workStart = timestampDoc.data().Start;
                        const workEnd = timestampDoc.data().End;

                        for (
                          let i = 0;
                          i < Math.min(workStart.length, workEnd.length);
                          i++
                        ) {
                          const [startHours, startMinutes] = workStart[i]
                            .split(":")
                            .map(Number);
                          const [endHours, endMinutes] = workEnd[i]
                            .split(":")
                            .map(Number);

                          const startMinutesSinceMidnight =
                            startHours * 60 + startMinutes;
                          const endMinutesSinceMidnight =
                            endHours * 60 + endMinutes;

                          totalMinutesWorked +=
                            endMinutesSinceMidnight - startMinutesSinceMidnight;
                        }
                      }

                      //date today
                      if (timestampDoc.id === currentDateString) {
                        //document from today
                        const workStart = timestampDoc.data().Start;
                        const workEnd = timestampDoc.data().End;

                        const currentDate = new Date();

                        let totalTimeWorked = 0;
                        active_today = true;
                        if (workStart.length > workEnd.length) {
                          workEnd.push(
                            currentDate.getHours() +
                              ":" +
                              currentDate.getMinutes()
                          );

                          workerListDash.innerHTML += htmlCodeOnline;
                        } else {
                          workerListDash.innerHTML += htmlCodeOffline;
                        }

                        // Berechnung der gearbeiteten Zeit
                        // Berechnung der gearbeiteten Zeit
                        for (
                          let i = 0;
                          i < Math.min(workStart.length, workEnd.length);
                          i++
                        ) {
                          const [startHours, startMinutes] = workStart[i]
                            .split(":")
                            .map(Number);
                          const [endHours, endMinutes] = workEnd[i]
                            .split(":")
                            .map(Number);
                          const startMinutesSinceMidnight =
                            startHours * 60 + startMinutes;
                          const endMinutesSinceMidnight =
                            endHours * 60 + endMinutes;
                          totalTimeWorked +=
                            endMinutesSinceMidnight - startMinutesSinceMidnight;
                        }

                        // Konvertierung der gearbeiteten Zeit zurück in "HH:MM" Format
                        const hoursWorked = Math.floor(totalTimeWorked / 60);
                        const minutesWorked = totalTimeWorked % 60;

                        const formattedTimeT = `${hoursWorked
                          .toString()
                          .padStart(2, "0")}h ${minutesWorked
                          .toString()
                          .padStart(2, "0")}min`;

                        if (!worked_hours.hasOwnProperty(docw.data().email)) {
                          worked_hours[docw.data().email] = {
                            today: formattedTimeT,
                          };
                        } else {
                          worked_hours[docw.data().email]["today"] =
                            formattedTimeT;
                        }
                      }
                      //date yesterday
                      if (yesterdayDateString === timestampDoc.id) {
                        const workStart = timestampDoc.data().Start;
                        const workEnd = timestampDoc.data().End;

                        const currentDate = new Date(); // Aktuelles Datum und Zeit
                        // const currentTimestamp = currentDate.getHours() * 60 + currentDate.getMinutes();

                        let totalTimeWorked = 0;
                        if (workStart.length > workEnd.length) {
                          workEnd.push("23:59");
                        }

                        for (
                          let i = 0;
                          i < Math.min(workStart.length, workEnd.length);
                          i++
                        ) {
                          const [startHours, startMinutes] = workStart[i]
                            .split(":")
                            .map(Number);
                          const [endHours, endMinutes] = workEnd[i]
                            .split(":")
                            .map(Number);
                          const startMinutesSinceMidnight =
                            startHours * 60 + startMinutes;
                          const endMinutesSinceMidnight =
                            endHours * 60 + endMinutes;
                          totalTimeWorked +=
                            endMinutesSinceMidnight - startMinutesSinceMidnight;
                        }

                        // Konvertierung der gearbeiteten Zeit zurück in "HH:MM" Format
                        const hoursWorked = Math.floor(totalTimeWorked / 60);
                        const minutesWorked = totalTimeWorked % 60;

                        const formattedTimeY = `${hoursWorked
                          .toString()
                          .padStart(2, "0")}h ${minutesWorked
                          .toString()
                          .padStart(2, "0")}min`;

                        if (!worked_hours.hasOwnProperty(docw.data().email)) {
                          worked_hours[docw.data().email] = {
                            yesterday: formattedTimeY,
                          };
                        } else {
                          worked_hours[docw.data().email]["yesterday"] =
                            formattedTimeY;
                        }
                      }
                    });

                    const hoursWorkedM = Math.floor(
                      totalMinutesWorkedInMonth / 60
                    );
                    const minutesWorkedM = totalMinutesWorkedInMonth % 60;
                    const formattedTotalTimeM = `${hoursWorkedM
                      .toString()
                      .padStart(2, "0")}h ${minutesWorkedM
                      .toString()
                      .padStart(2, "0")}min`;

                    const hoursWorked = Math.floor(totalMinutesWorked / 60);
                    const minutesWorked = totalMinutesWorked % 60;
                    const formattedTotalTime = `${hoursWorked
                      .toString()
                      .padStart(2, "0")}h ${minutesWorked
                      .toString()
                      .padStart(2, "0")}min`;
                    if (!worked_hours.hasOwnProperty(docw.data().email)) {
                      worked_hours[docw.data().email] = {
                        week: formattedTotalTime,
                      };
                      worked_hours[docw.data().email] = {
                        month: formattedTotalTimeM,
                      };
                    } else {
                      worked_hours[docw.data().email]["week"] =
                        formattedTotalTime;
                      worked_hours[docw.data().email]["month"] =
                        formattedTotalTimeM;
                    }

                    if (!active_today) {
                      workerListDash.innerHTML += htmlCodeOffline;
                    }
                  }
                })
                .catch((error) => {
                  console.error("Error getting timestamps documents: ", error);
                });
            });

            // Finde alle Buttons mit der Klasse "link-block w-inline-block"
            var buttons_wlayover = document.querySelectorAll(
              ".link-block.w-inline-block.worker"
            );

            // Iteriere über alle gefundenen Buttons und füge den Eventlistener hinzu
            buttons_wlayover.forEach(function (button) {
              button.addEventListener("click", function () {
                // Mache das Div mit der ID "geb_layover" sichtbar
                var wLayover = document.getElementById("worker_layover");

                // worked_hours[docw.data().email]["today"]

                const workerCollections = collection(companyDoc, "Users");
                getDoc(doc(workerCollections, button.id)).then(
                  (docSnapshot) => {
                    if (docSnapshot.exists()) {
                      var dataW = docSnapshot.data();
                      var emailW = dataW.email;
                      var nameW = dataW.name;

                      var clickHandlerW = function () {
                        const confirmation = confirm(
                          "Bist du sicher, dass du den Mitarbeiter löschen willst? Er/Sie kann im Nachhinein nicht mehr wiederhergestellt werden."
                        );

                        if (confirmation) {
                          // const docRef = doc(workerCollections, button.id);

                          ///###

                          
                          const requestBody = {
                            email: emailW,
                            company: companyName,
                          };
                        
                          fetch("https://haushelper-bot-4584298bee33.herokuapp.com/delete_user", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(requestBody),
                          })
                            .then((response) => {
                              if (response.ok) {
                                console.log("Mitarbeiter gelöscht!");
                                const companiesDocRef = doc(
                                  collection(db, "Companies"),
                                  companyName
                                );
                                const accessesRef = collection(
                                  companiesDocRef,
                                  "Accesses"
                                );
                                getDocs(accessesRef).then((querySnapshot) => {
                                  querySnapshot.forEach((doc) => {
                                    let w_available = parseInt(
                                      doc.data().userAvailable
                                    );
  
                                    if (!isNaN(w_available)) {
                                      w_available = w_available + 1;
  
                                      updateDoc(doc.ref, {
                                        userAvailable: w_available.toString(),
                                      })
                                        .then(() => {})
                                        .catch((error) => {
                                          console.error(
                                            "Fehler beim Aktualisieren der Anzahl verfügbarer Benutzer:",
                                            error
                                          );
                                        });
                                    }
                                  });
                                });
                                alert(
                                  "Der/Die Mitarbeiter/in wurde erfolgreich gelöscht. Der Zugang wurde gesperrt."
                                );
                                window.location.href = "/adminroom?tab=mitarbeiter-tab";
                        
                              } else {
                                console.error("Fehler beim Registrieren:", response.statusText);
                              }
                            })
                            .catch((error) => {
                              console.error("Fehler beim Registrieren:", error);
                            });
                            ///###

                        //   deleteDoc(docRef)
                        //     .then(() => {
                        //       const userCollection = collection(db, "Users");

                        //       const q = query(
                        //         userCollection,
                        //         where("email", "==", emailW)
                        //       );

                        //       getDocs(q)
                        //         .then((querySnapshot) => {
                        //           // Es wird erwartet, dass nur ein Dokument gefunden wird
                        //           if (!querySnapshot.empty) {
                        //             const doc = querySnapshot.docs[0];
                        //             // Dokument gefunden, lösche es
                        //             deleteDoc(doc.ref)
                        //               .then(() => {
                        //                 console.log(
                        //                   "Dokument erfolgreich gelöscht:",
                        //                   doc.id
                        //                 );
                        //               })
                        //               .catch((error) => {
                        //                 console.error(
                        //                   "Fehler beim Löschen des Dokuments:",
                        //                   error
                        //                 );
                        //               });
                        //           } else {
                        //             console.log(
                        //               "Es wurde kein Dokument mit der angegebenen E-Mail-Adresse gefunden."
                        //             );
                        //           }
                        //         })
                        //         .catch((error) => {
                        //           console.error(
                        //             "Fehler beim Ausführen der Abfrage:",
                        //             error
                        //           );
                        //         });

                        //       const companiesDocRef = doc(
                        //         collection(db, "Companies"),
                        //         companyName
                        //       );
                        //       const accessesRef = collection(
                        //         companiesDocRef,
                        //         "Accesses"
                        //       );
                        //       getDocs(accessesRef).then((querySnapshot) => {
                        //         querySnapshot.forEach((doc) => {
                        //           let w_available = parseInt(
                        //             doc.data().userAvailable
                        //           );

                        //           if (!isNaN(w_available)) {
                        //             w_available = w_available + 1;

                        //             updateDoc(doc.ref, {
                        //               userAvailable: w_available.toString(),
                        //             })
                        //               .then(() => {})
                        //               .catch((error) => {
                        //                 console.error(
                        //                   "Fehler beim Aktualisieren der Anzahl verfügbarer Benutzer:",
                        //                   error
                        //                 );
                        //               });
                        //           }
                        //         });
                        //       });

                        //       alert(
                        //         "Der/Die Mitarbeiter/in wurde erfolgreich gelöscht. Der Zugang wurde gesperrt."
                        //       );
                        //       window.location.reload();
                        //     })
                        //     .catch((error) => {
                        //       alert(
                        //         "Beim Löschen des Mitarbeiters ist ein Fehler aufgetreten: " +
                        //           error.message
                        //       );
                        //     });
                        } else {
                          alert("Das Löschen wurde abgebrochen.");
                        }
                      };

                      var del_bttn_W = document.getElementById("W_delete");
                      del_bttn_W.addEventListener("click", clickHandlerW);

                      document
                        .getElementById("worker_back")
                        .addEventListener("click", function () {
                          del_bttn_W.removeEventListener(
                            "click",
                            clickHandlerW
                          );
                        });

                      const workerHours = worked_hours[emailW] || {};

                      document.getElementById("w_time_yesterday").innerHTML =
                        workerHours["yesterday"] || "0h 00min";
                      document.getElementById("w_time_today").innerHTML =
                        workerHours["today"] || "0h 00min";
                      document.getElementById("w_time_week").innerHTML =
                        workerHours["week"] || "0h 00min";
                      document.getElementById("w_time_month").innerHTML =
                        workerHours["month"] || "0h 00min";

                      document.getElementById("w_name").innerHTML = nameW;
                      const taskHtmlArray =
                        worker_layover_task_today_list[emailW];

                      if (taskHtmlArray && taskHtmlArray.length > 0) {
                        for (var c_html of taskHtmlArray) {
                          document.getElementById(
                            "worker_layover_task_today"
                          ).innerHTML += c_html;
                        }
                      } else {
                        document.getElementById(
                          "worker_layover_task_today"
                        ).innerHTML = `<div class="text-block-26">Heute keine Aufgaben bei diesem Mitarbeiter!</div>`;
                      }
                    }
                  }
                );

                wLayover.style.display = "flex";
              });
            });
          });
        }
      });
    });
  } else {
    window.location.href = "/login";
  }
});

document.getElementById("calendar-tab").addEventListener("click", function () {
  setTimeout(function () {
    renderCalendar(newEvents);
  }, 500);
});

document.getElementById("aufgaben-tab").addEventListener("click", function () {
  setTimeout(function () {
    renderCalendar(newEvents);
  }, 500);
});

function renderCalendar(events) {
  let eventList = [];

  for (let id in events) {
    eventList.push({
      title: events[id]["title"],
      id: id,

      backgroundColor: events[id]["backgroudColor"],
      borderColor: "white",
      textColor: events[id]["textColor"],
      start: new Date(
        events[id].start.seconds * 1000 + events[id].start.nanoseconds / 1e6
      ),
      end: new Date(
        events[id].start.seconds * 1000 + events[id].start.nanoseconds / 1e6
      ),
      allDay: false,
    });
  }

  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    nowIndicator: true,
    eventLimit: true,
    views: {
      agenda: {
        eventLimit: 4,
      },
    },

    allDayText: "Ganztägig",
    initialDate: new Date(),
    locale: "de",

    events: eventList,

    buttonText: {
      today: "Heute",
      month: "Monat",
      week: "Woche",
      day: "Tag",
    },
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    timeFormat: "h:mm",
    eventClick: function (c, jsEvent, view) {
      const idC = c.el.fcSeg.eventRange.def.publicId;

      const popup = document.getElementById("kalender_popup");
      const taskTitle = events[idC].title;
      const taskDescription = events[idC].description;
      const taskDueDate = events[idC].start;
      const taskWorker = events[idC].worker;
      const taskBuilding = events[idC].building;
      const taskRepeat = events[idC].repeat;
      const taskDone = new Date(events[idC].done.seconds * 1000);
      const january1st2010 = new Date("2010-01-01T00:00:00Z");
      const resultDone =
        taskDone > january1st2010
          ? "Ja, am " + taskDone.toLocaleString()
          : "Nein, noch nicht erledigt.";

      document.getElementById("popup_title").textContent = taskTitle;
      document.getElementById("popup_description").textContent =
        taskDescription;
      document.getElementById("popup_time").textContent = new Date(
        taskDueDate.seconds * 1000
      ).toLocaleString();
      document.getElementById("popup_worker").textContent = taskWorker;
      document.getElementById("popup_done").textContent = resultDone;
      document.getElementById("popup_building").textContent = taskBuilding;
      document.getElementById("popup_repeat").textContent = taskRepeat;

      popup.style.display = "flex";
      popup.style.alignItems = "center";
      popup.style.justifyContent = "center";
    },
  });

  calendar.render();
}

document.getElementById("close_popup").addEventListener("click", function () {
  const popup = document.getElementById("kalender_popup");
  popup.style.display = "none";
});

document.getElementById("folder_back").addEventListener("click", function () {
  const popup = document.getElementById("folder_box");
  popup.style.display = "none";

  document.getElementById("files_list").innerHTML = "";
});

document.getElementById("geb_back").addEventListener("click", function () {
  document.getElementById("geb_images_info").innerHTML = "";
  document.getElementById("geb_images").innerHTML = "";

  document.getElementById("pdf_list").innerHTML = "";

  const popup = document.getElementById("geb_layover");
  popup.style.display = "none";
});

document.getElementById("worker_back").addEventListener("click", function () {
  const popup = document.getElementById("worker_layover");

  popup.style.display = "none";
  document.getElementById("worker_layover_task_today").innerHTML = "";
});

mitarbeiter_Calender_Select.addEventListener("change", function () {
  const selectedValue = mitarbeiter_Calender_Select.value;
  if (selectedValue == "cal_all") {
    renderCalendar(newEvents);
  } else {
    let workerList = {};

    for (const key in newEvents) {
      const item = newEvents[key];
      if (item.worker === selectedValue) {
        const { bgColor, textColor } = getRandomColor(item.worker);

        workerList[key] = {
          backgroundColor: bgColor,
          textColor: textColor,
          worker: selectedValue,
          title: newEvents[key].title,
          description: newEvents[key].description,
          start: newEvents[key].start,
          end: newEvents[key].end,
          repeat: newEvents[key].repeat,
          done: newEvents[key].done,
          building: newEvents[key].building,
          buildingID: newEvents[key].buildingID,
        };
      }
    }
    renderCalendar(workerList);
  }
});

function getRandomColor(worker) {
  if (workerColors.hasOwnProperty(worker)) {
    return workerColors[worker];
  }

  const randomHue = Math.floor(Math.random() * 360);
  const saturation = 70 + Math.random() * 10;
  const lightness = 50 + Math.random() * 10;
  const bgColor = `hsl(${randomHue}, ${saturation}%, ${lightness}%)`;
  const textColor = lightness > 60 ? "#000000" : "#ffffff";

  workerColors[worker] = { bgColor, textColor };

  return { bgColor, textColor };
}

async function deleteDocumentFromFirestore(documentId, taskCollection) {
  const taskRef = doc(taskCollection, documentId);
  try {
    await deleteDoc(taskRef);
    location.reload();
  } catch (error) {
    console.error("Fehler beim Löschen des Dokuments:", error);
  }
}

function getFacilityChild(doc) {
  const addressString =
    doc.data().address + ", " + doc.data().zipcode + " " + doc.data().city;
  var htmlCode = `
  <a id="${doc.id}" class="link-block w-inline-block" style="max-width:600px">
  <div class="text-block-22">${addressString}</div>
  <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/65fab68e154ecc79d4788cfe_arrow%20right.png" alt="" class="image-9"></a>
  `;

  return htmlCode;
}

function getWorkerChild(doc) {
  const name = doc.data().name;
  const mail = doc.data().email;
  const m_string = name + " | " + mail;

  var htmlCode = `
  <a id="${doc.id}" class="link-block w-inline-block worker" style="max-width:600px">
  <div class="text-block-22">${m_string}</div>
  <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/65fab68e154ecc79d4788cfe_arrow%20right.png" alt="" class="image-9"></a>
  `;

  return htmlCode;
}
document
  .getElementById("expand_worker_tasks")
  .addEventListener("click", function () {
    var button = document.getElementById("expand_worker_tasks");
    if (button.textContent === "Erweitern") {
      button.textContent = "Schließen";
      expand_widget("worker_tasks_box", [
        "worker_arbeitszeit",
        "worker_stundenzettel",
      ]);
    } else {
      button.textContent = "Erweitern";
      setTimeout(function () {
        collapse_widget("worker_tasks_box", [
          "worker_arbeitszeit",
          "worker_stundenzettel",
        ]);
      }, 200);
    }
  });

document.getElementById("bilder_expand").addEventListener("click", function () {
  var button = document.getElementById("bilder_expand");
  if (button.textContent === "Erweitern") {
    button.textContent = "Schließen";
    expand_widget("bilder_widget", [
      "kunde_widget",
      "info_widget",
      "datei_widget",
    ]);
    document.getElementById("image_box_expand").style.height = "70vh";
  } else {
    button.textContent = "Erweitern";
    setTimeout(function () {
      collapse_widget("bilder_widget", [
        "kunde_widget",
        "info_widget",
        "datei_widget",
      ]);
      document.getElementById("image_box_expand").style.height = "300px";
    }, 200);
  }
});

function expand_widget(expand_id, collapse_ids) {
  var expandElement = document.getElementById(expand_id);
  if (expandElement) {
    expandElement.style.transition = "width 0.4s ease, height 0.4s ease";
    expandElement.style.width = "90vw";
    expandElement.style.height = "70vh";
  }

  if (collapse_ids && Array.isArray(collapse_ids)) {
    collapse_ids.forEach(function (collapse_id) {
      var collapseElement = document.getElementById(collapse_id);
      if (collapseElement) {
        collapseElement.style.display = "none";
      }
    });
  }
}

function collapse_widget(expand_id, collapse_ids) {
  var expandElement = document.getElementById(expand_id);
  if (expandElement) {
    expandElement.style.width = "100%";
    expandElement.style.height = "100%";
  }

  if (collapse_ids && Array.isArray(collapse_ids)) {
    collapse_ids.forEach(function (collapse_id) {
      var collapseElement = document.getElementById(collapse_id);
      if (collapseElement) {
        setTimeout(function () {
          collapseElement.style.display = "block";
        }, 500);
      }
    });
  }
}


//bei datei hochladen += inner html dass kein reload nötig ist

//delete button bei files

//information rendern + ändern + löschen

//informationen erstellen

