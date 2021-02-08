function confirmInsert(email, date, time,alertElement) {
    alertElement.innerHTML = `<div class="alert alert-warning alert-dismissible" role="alert">
        <strong>Successful added customer ${email}.</strong> Selected date: ${date}, time: ${time}.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
}

function alertShow(email,alertElement) {
    alertElement.innerHTML = `<div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>${email} already exists</strong>! Submission of form failed.
        </div>`
}

function fillInAllFields(alertElement) {
    alertElement.innerHTML = `<div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Please fill in all fields</strong>! Submission of form failed.
        </div>`
}

function dateCheckMessage(firstDay, lastDay,alertElement) {
    alertElement.innerHTML = `<div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Please add correct date</strong>! It should be today, day after today or date between 
            ${firstDay} and ${lastDay}.
        </div>`
}

export {dateCheckMessage,fillInAllFields,alertShow,confirmInsert};