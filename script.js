document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".content-switcher").addEventListener("click", swapContent);
  document.querySelector(".area-calculator").addEventListener("click", calculateArea);
  document.querySelector(".calculate-words").addEventListener("click", calculateWords);
});

function swapContent() {
  const contentLeft = document.querySelector(".content-left-bottom");
  const contentRight = document.querySelector(".content-right");
  const temp = contentLeft.innerHTML;
  contentLeft.innerHTML = contentRight.innerHTML;
  contentRight.innerHTML = temp;
}

function calculateArea() {
  const a = 10.0;
  const b = 15.0;
  const square = (a * b * Math.PI).toFixed(2);
  document.querySelector(".area-of-oval").innerHTML += `<div>Square of oval is ${square}</div>`;
}

function calculateWords() {
  const textInput = document.querySelector(".text-input").value.trim();
  const words = textInput ? textInput.split(" ").length : 0;
  alert(`Кількість слів: ${words}`);
  setCookie("wordCount", words, 7);
}

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

window.addEventListener("load", () => {
  const savedWords = getCookie("wordCount");
  if (savedWords) {
    const deleteConfirm = confirm(`Збережені дані: кількість слів - ${savedWords}. Видалити дані з cookies?`);
    if (deleteConfirm) {
      deleteCookie("wordCount");
      location.reload();
    } else {
      alert("Cookies збережено. Оновіть сторінку для повторного вводу даних.");
      disableWordCountInput();
    }
  }
});

function disableWordCountInput() {
  document.querySelector(".text-input").disabled = true;
  document.querySelector(".calculate-words").disabled = true;
}

function handleDoubleClick(event) {
  const checkboxes = {
    left: document.querySelector(".content-checkbox-left"),
    middle: document.querySelector(".content-checkbox-middle"),
    right: document.querySelector(".content-checkbox-right"),
  };
  const contentSections = {
    left: document.querySelector(".content-left-bottom"),
    middle: document.querySelector(".content-middle-top"),
    right: document.querySelector(".content-right"),
  };

  for (const section in checkboxes) {
    const sectionElement = contentSections[section];
    const checkbox = checkboxes[section];

    if (checkbox.checked) {
      sectionElement.classList.add("justify-left");
      localStorage.setItem(`${section}-justify-left`, "true");
    } else {
      sectionElement.classList.remove("justify-left");
      localStorage.setItem(`${section}-justify-left`, "false");
    }
  }
}

function loadFromStorage() {
  const contentSections = {
    left: document.querySelector(".content-left-bottom"),
    middle: document.querySelector(".content-middle-top"),
    right: document.querySelector(".content-right"),
  };

  for (const section in contentSections) {
    const sectionElement = contentSections[section];
    if (localStorage.getItem(`${section}-justify-left`) === "true") {
      sectionElement.classList.add("justify-left");
    } else {
      sectionElement.classList.remove("justify-left");
    }
  }
}

function initializeBlocks() {
  const blockNames = [
    "content-header",
    "content-left-top",
    "content-middle-top",
    "content-right",
    "content-left-bottom",
    "content-middle-bottom",
    "content-footer",
  ];

  blockNames.forEach((blockName) => {
    const block = document.querySelector(`.${blockName}`);
    const blockContent = block.innerHTML;

    if (!localStorage.getItem(`initial-custom-${blockName}`)) {
      localStorage.setItem(`initial-custom-${blockName}`, blockContent);
    }

    if (!localStorage.getItem(`custom-${blockName}`)) {
      localStorage.setItem(`custom-${blockName}`, blockContent);
    }
  });
}

function loadBlockContent(blockName) {
  const block = document.querySelector(`.${blockName}`);
  const savedContent = localStorage.getItem(`custom-${blockName}`);

  if (savedContent) {
    block.innerHTML = savedContent;
    block.classList.add("edited-content");
  }
}

function createEditor(blockName) {
  const block = document.querySelector(`.${blockName}`);
  const editorContainer = document.querySelector(".editor-container");
  const currentContent = block.innerHTML;

  editorContainer.innerHTML = "";

  const textarea = document.createElement("textarea");
  textarea.value = currentContent;
  const saveButton = document.createElement("button");
  saveButton.textContent = "Зберегти зміни";
  const resetButton = document.createElement("button");
  resetButton.textContent = "Відновити початковий вміст";

  editorContainer.appendChild(textarea);
  editorContainer.appendChild(saveButton);
  editorContainer.appendChild(resetButton);

  saveButton.addEventListener("click", () => {
    const updatedContent = textarea.value;
    localStorage.setItem(`custom-${blockName}`, updatedContent);
    loadBlockContent(blockName);
  });

  resetButton.addEventListener("click", () => {
    const initialContent = localStorage.getItem(`initial-custom-${blockName}`);
    block.innerHTML = initialContent;
    block.classList.remove("edited-content");
    editorContainer.innerHTML = "";
    localStorage.setItem(`custom-${blockName}`, initialContent);
  });
}

function loadAllBlockContents() {
  const blockNames = [
    "content-header",
    "content-left-top",
    "content-middle-top",
    "content-right",
    "content-left-bottom",
    "content-middle-bottom",
    "content-footer",
  ];

  blockNames.forEach((blockName) => {
    loadBlockContent(blockName);
  });
}

initializeBlocks();
loadAllBlockContents();
loadFromStorage();
document.body.addEventListener("dblclick", handleDoubleClick);

document.querySelector(".select").addEventListener("change", (e) => {
  const selectedBlockName = e.target.value;
  createEditor(selectedBlockName);
});
