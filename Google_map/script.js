// Button click event
let getbtn = document.querySelector(".getdata");
getbtn.addEventListener("click", () => {
  getbtn.style.display = "none";
  searchBox.style.display = "block";
  getUserIP();
});

document.addEventListener("DOMContentLoaded", () => {
  displayIP(); 
});

// Fetch IP address
function getUserIP() {
  fetch("https://ipinfo.io/?token=724753bfb1be18")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const ipAddress = data.ip;
    //   displayIP(ipAddress);
      displayData(data);
      fetchPostOffices(data.postal);
    })
    .catch((error) => {
      console.error("Error occurred while retrieving IP address:", error);
    });
}



// Display IP address
function displayIP() {
    fetch("https://ipinfo.io/?token=724753bfb1be18")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const ipAddress = data.ip;
        let heading = document.getElementById('heading');
        let ipAddressElement = document.createElement('span');
        ipAddressElement.textContent = ipAddress;
        heading.appendChild(ipAddressElement);
      })
      .catch((error) => {
        console.error("Error occurred while retrieving IP address:", error);
      });
  }
  



function displayData(data) {
    let info = document.getElementById('info');
  
   // Create the first div
   let div1 = document.createElement('div');
   let para1_1 = document.createElement('p');
   para1_1.innerHTML = `<b>Lat:</b>  ${data.loc.split(',')[0]}`;
   let para1_2 = document.createElement('p');
   para1_2.innerHTML = `<b>Long:</b>  ${data.loc.split(',')[1]}`;
   div1.appendChild(para1_1);
   div1.appendChild(para1_2);
 
   // Create the second div
   let div2 = document.createElement('div');
   let para2_1 = document.createElement('p');
   para2_1.innerHTML = `<b>City:</b> ${data.city}`;
   let para2_2 = document.createElement('p');
   para2_2.innerHTML = `<b>Region:</b> ${data.region}`;
   div2.appendChild(para2_1);
   div2.appendChild(para2_2);
 
   // Create the third div
   let div3 = document.createElement('div');
   let para3_1 = document.createElement('p');
   para3_1.innerHTML = `<b>Organisation: </b>${data.org}`;
   let para3_2 = document.createElement('p');
   para3_2.innerHTML = `<b>Hostname: </b>${(data.hostname || 'N/A')}`;
   div3.appendChild(para3_1);
   div3.appendChild(para3_2);

  // Append the divs to the info div
  info.appendChild(div1);
  info.appendChild(div2);
  info.appendChild(div3);

  let map = document.getElementById('map');
  let iframe = document.createElement('iframe');
  iframe.src = `https://maps.google.com/maps?q=${data.loc}&z=15&output=embed`;
  iframe.width = "100%";
  iframe.height = "320";
  
  iframe.style.border = "none";
  iframe.style.margin = "10px";
  map.appendChild(iframe);

  let info2 = document.getElementById('info2');
  let infoDiv2 = document.createElement('div');
  infoDiv2.className = 'info2';

  let timeParagraph = document.createElement('p');
  let currentTime = new Date().toLocaleTimeString();
  timeParagraph.innerHTML = `<b>Time Zone:</b> ${data.timezone}`;

  let dateParagraph = document.createElement('p');
  let currentDate = new Date().toLocaleDateString();
  dateParagraph.innerHTML = `<b>Date And Time: </b>${currentDate + ', ' + currentTime}`;

  let pinParagraph = document.createElement('p');
  pinParagraph.innerHTML = `<b>Pincode: </b> ${data.postal}`;

  let messageParagraph = document.createElement('p');
  messageParagraph.innerHTML = `<b>Message:</b> Number of pincode(s) found: 4`;

  appendInfoContainer(infoDiv2, timeParagraph);
  appendInfoContainer(infoDiv2, dateParagraph);
  appendInfoContainer(infoDiv2, pinParagraph);
  appendInfoContainer(infoDiv2, messageParagraph);

  info2.appendChild(infoDiv2);
}



  function createInfoContainer(label, value) {
    let infoContainer = document.createElement('div');
    infoContainer.className = 'info-container';
  
    let labelParagraph = document.createElement('p');
    labelParagraph.textContent = label + ': ';
  
    let valueParagraph = document.createElement('p');
    valueParagraph.textContent = value;
  
    infoContainer.appendChild(labelParagraph);
    infoContainer.appendChild(valueParagraph);
  
    return infoContainer;
  }
  
  
  function appendInfoContainer(parent, container) {
    parent.appendChild(container);
  }
  

const searchBox = createInputElement('text', 'searchBox', 'Search by name or branch type');
document.body.appendChild(searchBox);
const postOfficeContainer = createDivElement('postOfficeContainer');
document.body.appendChild(postOfficeContainer);


searchBox.addEventListener("input", () => {
  displayPostOffices();
  filtersearch();
});
//postalpincode
function fetchPostOffices(pincode) {
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const postOffices = data[0].PostOffice;
      displayPostOffices(postOffices);
    })
    .catch((error) => {
      console.error("Error occurred while retrieving post offices:", error);
    });
}
function createInputElement(type, id, placeholder) {
  let inputElement = document.createElement('input');
  inputElement.type = type;
  inputElement.id = id;
  inputElement.placeholder = "Filter";
  return inputElement;
}
function createDivElement(id) {
  let divElement = document.createElement('div');
  divElement.id = id;
  return divElement;
}
function displayPostOffices(data) {
  postOfficeContainer.innerHTML = "";

  let searchTerm = searchBox.value.toLowerCase();
  let filteredData = data.filter((postOffice) => {
    return (
      postOffice.Name.toLowerCase().includes(searchTerm) ||
      postOffice.BranchType.toLowerCase().includes(searchTerm)
    );
  });
  filteredData.forEach((postOffice) => {
    let postOfficeElement = createDivElement('postOffice');
    postOfficeElement.className = "postOfficeElement";
    let nameElement = createParagraphElement('Name', postOffice.Name);
    let branchTypeElement = createParagraphElement('Branch Type', postOffice.BranchType);
    let deliveryStatusElement = createParagraphElement('Delivery Status', postOffice.DeliveryStatus);
    let districtElement = createParagraphElement('District', postOffice.District);
    let divisionElement = createParagraphElement('Division', postOffice.Division);

    postOfficeElement.appendChild(nameElement);
    postOfficeElement.appendChild(branchTypeElement);
    postOfficeElement.appendChild(deliveryStatusElement);
    postOfficeElement.appendChild(districtElement);
    postOfficeElement.appendChild(divisionElement);

    postOfficeContainer.appendChild(postOfficeElement);
  });
}
//filter
function filtersearch() {
  const filter = searchBox.value.toUpperCase();
  const postOfficeList = document.getElementById("postOfficeList");
  const listItems = postOfficeList.getElementsByTagName("ul");

  for (let i = 0; i < listItems.length; i++) {
    const listItem = listItems[i];
    const text = listItem.textContent || listItem.innerText;
    if (text.toUpperCase().indexOf(filter) > -1) {
      listItem.style.display = "";
    }
    else {
        listItem.style.display = "none";
      }
    }
  }
    function createParagraphElement(label, value) {
    let paragraphElement = document.createElement('p');
    paragraphElement.textContent = label + ': ' + value;
    return paragraphElement;
  }