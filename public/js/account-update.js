const updateForm = document.getElementById('update-account-form');
updateForm.addEventListener('change', () => {
    const updatebtn = document.getElementById('update-account-btn');
    updatebtn.removeAttribute('disabled');
});