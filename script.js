// Scroll to top when page loads or refreshes
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Run on both DOMContentLoaded and load events
document.addEventListener('DOMContentLoaded', function() {
    scrollToTop();
    
    // Also scroll to top after the page is fully loaded
    window.addEventListener('load', scrollToTop);
    
    // Force scroll to top as a fallback
    setTimeout(scrollToTop, 100);
    
    // Hide the success modal when the page loads
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'none';
    }
    
    const form = document.getElementById('registrationForm');
    const scriptUrl = document.getElementById('scriptUrl')?.value;
    const modalContent = document.querySelector('.modal-content p');

    // Check if elements exist before adding event listeners
    if (!form || !scriptUrl) {
        console.error('Required elements not found in the DOM');
        return;
    }

    // Close modal when clicking the close button if it exists
    const closeButton = document.getElementById('closeModal');
    if (closeButton && successModal) {
        closeButton.addEventListener('click', function() {
            successModal.style.display = 'none';
        });

        // Close modal when clicking outside the modal content
        window.addEventListener('click', function(event) {
            if (event.target === successModal) {
                successModal.style.display = 'none';
            }
        });
    }

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        const phoneNumber = formValues.phone || formValues.whatsapp;

        // Basic validation
        if (!formValues.name || !formValues.age || !formValues.address || !phoneNumber) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if age is a valid number
        if (isNaN(formValues.age) || formValues.age < 1 || formValues.age > 120) {
            alert('Please enter a valid age between 1 and 120.');
            return;
        }

        // Convert form data to URL-encoded format
        const urlEncoded = new URLSearchParams();
        urlEncoded.append('name', formValues.name);
        urlEncoded.append('age', formValues.age);
        urlEncoded.append('address', formValues.address);
        urlEncoded.append('phone', formValues.phone);
        urlEncoded.append('email', formValues.email || '');
        urlEncoded.append('whatsapp', formValues.whatsapp || formValues.phone || '');
        urlEncoded.append('consent', formValues.consent ? 'true' : 'false');
        urlEncoded.append('timestamp', new Date().toISOString());

        try {
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Submitting...';

            console.log('Sending data to Google Apps Script:', urlEncoded.toString());
            
            // Send URL-encoded data
            const response = await fetch(scriptUrl, {
                method: 'POST',
                cache: 'no-cache',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: urlEncoded.toString()
            });

            // Log response status for debugging
            console.log('Response status:', response.status);
            
            // Since we're using no-cors mode, we can't read the response
            // But we'll assume success if we don't get an error
           try {
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Submitting...';

    console.log('Sending data to Google Apps Script:', urlEncoded.toString());
    
    // Send URL-encoded data
    const response = await fetch(scriptUrl, {
        method: 'POST',
        cache: 'no-cache',
        redirect: 'follow',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: urlEncoded.toString()
    });

    // Parse JSON response
    const result = await response.json();
    console.log('Form submission result:', result);

    if (result.status === 'success') {
        // Show success modal
        if (modalContent && successModal) {
            modalContent.innerHTML = `
                <p>നിങ്ങളുടെ രജിസ്ട്രേഷൻ വിജയകരമായി സമർപ്പിച്ചു. (Your registration has been submitted successfully.)</p>
                <p>നിങ്ങളുടെ ഇമെയിലിൽ ഒരു സ്ഥിരീകരണം അയച്ചിട്ടുണ്ട്. (A confirmation has been sent to your email.)</p>
            `;
            successModal.style.display = 'block';
            form.reset();
        }
    } else {
        alert('Error: ' + result.message);
    }

} catch (error) {
    console.error('Error details:', {
        message: error.message,
        name: error.name,
        data: urlEncoded.toString()
    });
    alert(`Error: ${error.message || 'An error occurred while submitting the form. Please try again.'}`);
} finally {
    // Reset button state
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    }
}

    });

});



