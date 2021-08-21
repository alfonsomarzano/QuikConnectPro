const { protocol, ipcRenderer } = require('electron');
const remote = require('electron').remote;
const fs = require('fs')
const path = require("path")
const _ = require("underscore")
var objArray = null;

$(() => {

    var jsString = fs.readFileSync(path.join(__dirname, "items.json"), "utf-8")
    objArray = JSON.parse(jsString)
    objArray = _.sortBy(objArray, 'Quick').reverse()
    objArray.forEach(element => {
        addRow(element)
    });
})


$("#searchbyip").keyup(function(event) {
    var txtInput = $('#searchbyip').val()
    var items = objArray.filter(i => i.IpOrDN.includes(txtInput))
    $("#results > .row").css('display', 'none')
    items.forEach(itm => {
        $('#results > .row[conn-id="' + itm.Id + '"]').css('display', '')
    })
})

$("#searchbyip").on('keypress', function(e) {
    if (e.which == 13) {
        var txtInput = $('#searchbyip').val()
        var items = objArray.filter(i => i.IpOrDN.includes(txtInput))
        $('#results > .row[conn-id="' + items[0].Id + '"]').click()
    }
})

$("#searchbydesc").keyup(() => {
    var txtInput = $('#searchbydesc').val()
    var items = objArray.filter(i => i.Description.includes(txtInput))
    $("#results > .row").css('display', 'none')
    items.forEach(itm => {
        $('#results > .row[conn-id="' + itm.Id + '"]').css('display', '')
    })
})

$("#searchbydesc").on('keypress', function(e) {
    if (e.which == 13) {
        var txtInput = $('#searchbydesc').val()
        var items = objArray.filter(i => i.Description.includes(txtInput))
        $('#results > .row[conn-id="' + items[0].Id + '"]').click()
    }
})

$("#addForm").submit(function(event) {
    var target = event.target

    var value = new Object()
    value.Id = generateGuid()
    value.ConnectionType = event.target.ConnectionType.value
    value.Description = event.target.Description.value
    value.IpOrDN = event.target.IpOrDN.value
    value.Username = event.target.Username.value
    value.Password = event.target.Password.value
    value.Param3 = event.target.Param3.value
    value.Quick = false


    if (value.IpOrDN.includes("http"))
        value.Favicon = getFaviconUrl(value.IpOrDN)

    objArray.push(value)
    fs.writeFileSync(path.join(__dirname, "items.json"), JSON.stringify(objArray), "utf-8")
    ipcRenderer.send("reloadMain")

    var window = remote.getCurrentWindow()
    window.close()
    event.preventDefault()
});

$("#btn-add").click(() => {
    ipcRenderer.send("openview-add")
})



function addRow(el) {
    var protocol = $("<span></span>").addClass("protocol proto").text(el.ConnectionType.toUpperCase())
    if (el.ConnectionType == "HTP" || el.ConnectionType == "HTS") {
        var ip = $("<span></span>").addClass("ip").text(el.IpOrDN.replace(/(^\w+:|^)\/\//, ''))
        protocol = $("<img></img>").attr("src", getFaviconUrl(el.IpOrDN)).addClass("favimg")
    } else {
        var ip = $("<span></span>").addClass("ip").text(el.IpOrDN)
    }


    var colLeft = $("<div></div>").addClass("col-6  d-flex align-items-center")
    colLeft.append(protocol)
    colLeft.append(ip)
    var txtDescr = $("<span></span>").text(el.Description)
    var colRight = $("<div></div>").addClass("col-6  d-flex align-items-end justify-content-end")

    if (el.Quick == true)
        var pin = $("<span></span>").addClass("pin").text("📌")

    colRight.append(pin)
    colRight.append(txtDescr)

    var row = $("<div></div>").addClass("row " + el.ConnectionType.toLowerCase()).attr('conn-id', el.Id)

    row.append(colLeft)
    row.append(colRight)

    row.click((evt) => {
        var id = $(evt.target).closest(".row").attr('conn-id')
        var itm = objArray.find(i => i.Id == id)
        ipcRenderer.send("open-connection", JSON.stringify(itm))
    })

    $("#results").append(row)
}

function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20)
            result = result + '-';
        i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
        result = result + i;
    }
    return result;
}

function getFaviconUrl(path) {
    var pathArray = path.split('/');
    var protocol = pathArray[0];
    var host = pathArray[2];
    return protocol + '//' + host + "/favicon.ico";
}