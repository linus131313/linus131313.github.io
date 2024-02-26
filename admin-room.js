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
  updateDoc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  deleteObject,
  listAll,
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

//modal popup to delete tasks

function confirmDelete() {
  console.log("Confiirm");
}

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
//end disable/enable buttons

var companyName;

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

function handleGForm(e) {
  e.preventDefault();
  e.stopPropagation();
  const street = document.getElementById("str_geb").value;
  const plz = document.getElementById("plz_geb").value;
  const location = document.getElementById("standort_geb").value;
  const companiesDocRef = doc(collection(db, "Companies"), companyName);
  const newDocumentData2 = {
    address: street,
    city: location,
    zipcode: plz,
    counterelectricity: "0",
    countergas: "0",
    counterwater: "0",
    information: "[[]]",
  };
  const newSubcollectionRef = collection(companiesDocRef, "Buildings");
  addDoc(newSubcollectionRef, newDocumentData2);
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
  }
}

onAuthStateChanged(auth, (user) => {
  let publicElements = document.querySelectorAll("[data-onlogin='hide']");
  let privateElements = document.querySelectorAll("[data-onlogin='show']");
  if (user) {
    const adminsRef = collection(db, "Admins");
    getDocs(adminsRef).then((querySnapshot) => {
      querySnapshot.forEach((docx) => {
        if (docx.data().email === user.email) {
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

          //iteriere durch jede task
          const taskCollection = collection(companyDoc, "Tasks");
          getDocs(taskCollection).then((querySnapshot) => {
            if (!querySnapshot.empty) {
              querySnapshot.forEach((taskdoc) => {
                const time = taskdoc.data().issued;
                const dateFromTimestamp = new Date(time.seconds * 1000);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const taskListDash = document.getElementById("task_list_dash");
                const taskIssued = new Date(
                  taskdoc.data().issued.seconds * 1000
                );

                const formattedDate = `${taskIssued
                  .getDate()
                  .toString()
                  .padStart(2, "0")}.${(taskIssued.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}`;

                const formattedTime = `${taskIssued
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${taskIssued
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;

                const taskDone = new Date(taskdoc.data().done.seconds * 1000);
                const january1st2010 = new Date("2010-01-01T00:00:00Z");

                //aufgaben tab übersicht
                const taskListTab = document.getElementById("task_list_tab");
                if (taskDone > january1st2010) {
                  taskListTab.innerHTML += `
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
                          <button id="${
                            taskdoc.id
                          }" class="deleteTaskButton" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: transparent;"></button>                    <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" alt="" class="image-8">
                          </div>
                  </div><br>`;
                } else {
                  if ((new Date() - taskIssued) / (1000 * 60 * 60) > 1) {
                    //wenn aufgabe nach einer stunde immernoch nicht bearbeitet wurde
                    taskListTab.innerHTML += `
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
                            <button id="${
                              taskdoc.id
                            }" class="deleteTaskButton" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: transparent;"></button>                    <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" alt="" class="image-8">
                            </div>
                    </div><br>`;
                  } else {
                    taskListTab.innerHTML += `
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
                    <button id="${
                      taskdoc.id
                    }" class="deleteTaskButton" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background: transparent;"></button>                    <img loading="lazy" src="https://assets-global.website-files.com/63ef532ba90a07a5daf4a694/651da4e791f4e10b7dac637d_Trash%20(1).png" alt="" class="image-8">
                    
                    </div>
                    </div><br>`;
                  }
                }

                //wenn task heute ist zu dahboard hinzufügen
                if (dateFromTimestamp.toDateString() === today.toDateString()) {
                  if (taskDone > january1st2010) {
                    taskListDash.innerHTML += `
<div class="columns-14 w-row">
    <div class="column-23 w-col w-col-6">
        <div class="text-block-19-copy-copy-copy">${taskdoc.data().title}</div>
        <div class="text-block-19-copy-copy">${taskdoc.data().building}</div>
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
                  } else {
                    if ((new Date() - taskIssued) / (1000 * 60 * 60) > 1) {
                      //wenn aufgabe nach einer stunde immernoch nicht bearbeitet wurde
                      taskListDash.innerHTML += `
<div class="columns-14 w-row">
    <div class="column-23 w-col w-col-6">
        <div class="text-block-19-copy-copy-copy">${taskdoc.data().title}</div>
        <div class="text-block-19-copy-copy">${taskdoc.data().building}</div>
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
                    } else {
                      taskListDash.innerHTML += `
<div class="columns-14 w-row">
    <div class="column-23 w-col w-col-6">
        <div class="text-block-19-copy-copy-copy">${taskdoc.data().title}</div>
        <div class="text-block-19-copy-copy">${taskdoc.data().building}</div>
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

              const deleteTaskButtons = document.querySelectorAll(".deleteTaskButton");
              console.log(deleteTaskButtons);
              console.log("task buttons");
deleteTaskButtons.forEach((button) => {
    button.addEventListener("click", function () {
        console.log("Button ID:", button.id);
        // Hier können Sie den Code für das Löschen der Aufgabe aus Firebase einfügen
    });
});

              // renderCalendar(newEvents);
            }
          });

          getDocs(facilityCollections).then((querySnapshot) => {
            const userList = document.querySelector("#facilityList");
            var once = true;
            var buttonContainer = document.getElementById("button-container");
            querySnapshot.forEach((docz) => {
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
              button.appendChild(userInput);
              buttonContainer.appendChild(button);
              const listItem = document.createElement("li");
              listItem.textContent =
                docz.data().address +
                ", " +
                docz.data().zipcode +
                " " +
                docz.data().city;
              userList.appendChild(listItem);
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
              document.getElementById("status").innerHTML = status;
              document.getElementById("abo").innerHTML = docy.data().aboName;

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
            });
          });
          getDocs(userCollections).then((querySnapshot) => {
            const userList = document.querySelector("#userList");
            querySnapshot.forEach((docw) => {
              // const listItem = document.createElement("li");
              // listItem.textContent = docw.data().name;
              // userList.appendChild(listItem);
              // var active=false;
              const active = Math.random() < 0.5;

              const htmlCodeOffline = `
<div class="columns-14 w-row">
    <div class="column-23 w-col w-col-5">
        <div class="text-block-19-copy-copy">${docw.data().name}</div>
    </div>
    <div class="w-col w-col-4">
        <div id="tasks_done_counter" class="text-block-19-copy">0/0</div>
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
        <div class="text-block-19-copy-copy">${docw.data().name}</div>
    </div>
    <div class="w-col w-col-4">
        <div id="tasks_done_counter" class="text-block-19-copy">0/0</div>
    </div>
    <div class="column-24 w-col w-col-3">
        <div class="div-block-green">
            <div class="text-block-19-copy">
                <strong class="bold-text-green">aktiv</strong>
            </div>
        </div>
    </div>
</div>`;

              const workerListDash =
                document.getElementById("worker_list_dash");

              if (active) {
                workerListDash.innerHTML += htmlCodeOnline;
              } else {
                workerListDash.innerHTML += htmlCodeOffline;
              }
            });
          });
        }
      });
    });
    //const uid = user.uid;
    // privateElements.forEach(function (element) {
    //   element.style.display = "initial";
    // });
    // publicElements.forEach(function (element) {
    //   element.style.display = "none";
    // });
  } else {
    window.location.href = "/login";
    // publicElements.forEach(function (element) {
    //   element.style.display = "initial";
    // });
    // privateElements.forEach(function (element) {
    //   element.style.display = "none";
    // });
  }
});

document.getElementById("calendar-tab").addEventListener("click", function () {
  console.log("Klick");
  setTimeout(function () {
    renderCalendar(newEvents);
  }, 500);
});

document.getElementById("aufgaben-tab").addEventListener("click", function () {
  console.log("Klick");
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
      ////
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

// document.addEventListener("DOMContentLoaded", function () {
//   console.log("Ausf.");

//   setTimeout(function () {
//       const deleteTaskButtons = document.querySelectorAll(".deleteTaskButton");
//       console.log(deleteTaskButtons);
//       console.log("zahs it");

//       deleteTaskButtons.forEach((button) => {
//           console.log("Listener ready btn");
//           button.addEventListener("click", function () {
//               console.log("Button ID:", button.id);
//               // Hier können Sie den Code für das Löschen der Aufgabe aus Firebase einfügen
//           });
//       });
//   }, 500); // Verzögerung von 500 Millisekunden
// });
