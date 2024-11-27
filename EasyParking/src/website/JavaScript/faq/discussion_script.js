document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('questionForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form submission
        const emailInput = document.querySelector('input[type="email"]');
        const emailInputGroup = document.getElementById('questionEmail');
        const emailMessageDiv = document.getElementById('questionEmailMessage');
        const questionInput = document.getElementById('question')
        const issueDescription = document.getElementById('issue-description');
        const email = emailInput.value;
        const question = questionInput.value;
        const issue = issueDescription.value;
    
        const regex = /^[^\s@]+@uri\.edu$/;
        if (!regex.test(email)) {
            emailInputGroup.classList.add('is-invalid');
            emailMessageDiv.textContent = 'Please enter a valid email address.';
            emailMessageDiv.classList.add('invalid-feedback');
      
            setTimeout(() => {
                emailInputGroup.classList.remove('is-invalid');
                emailMessageDiv.textContent = '';
                emailMessageDiv.classList.remove('invalid-feedback');
            }, 4000);
            return;
        }
    
        try {
          const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/storeQuestion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, question, issue }),
          });
    
          if (response.ok) {
            // Close the modal using Bootstrap's modal hide method
            const modalBootstrap = bootstrap.Modal.getInstance(exampleModal); // Get the modal instance
            modalBootstrap.hide();
            questionInput.value = ''; // Clear the question input
            issueDescription.value = ''; // Clear the issue description input
    
            // Delay to allow modal to close before showing the toast
            setTimeout(() => {
              const toastBootstrap = bootstrap.Toast.getOrCreateInstance(questionToast);
              toastBootstrap.show();
            }, 500); // Adjust delay as needed 
          } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
          }
        } catch (error) {
          console.error('Error submitting question:', error);
          alert('An error occurred while submitting your question. Please try again later.');
        }
    });
    
    // Retrieve questions from database and display them
    const discussionSection = document.getElementById('discussion-questions');

    async function fetchQuestions() {
        try {
            const response = await fetch('https://us-central1-easyparking-d43a9.cloudfunctions.net/getQuestions');
            if (!response.ok) {
            throw new Error('Failed to fetch questions');
            }
            const questions = await response.json();

            // Clear existing questions before displaying new ones
            discussionSection.innerHTML = '';

            // Populate the discussion section with questions
            questions.forEach((questionsData) => {
            const questionElement = document.createElement('a');
            questionElement.href = `faq.html#question-${questionsData.id}`;
            questionElement.classList = 'list-group-item list-group-item-action d-flex gap-3 py-3';
            questionElement.setAttribute('aria-current', 'true');
            // Format the date
            const date = new Date(questionsData.date._seconds * 1000);
            const timeAgo = new Date() - date;
            const minutesAgo = Math.floor(timeAgo / 60000);
            const hoursAgo = Math.floor(minutesAgo / 60);
            const daysAgo = Math.floor(hoursAgo / 24);
            // Determine the time string, to see how long ago it was posted
            let timeString;
            if (daysAgo > 0) {
                timeString = `${daysAgo} days ago`;
            }
            else if (hoursAgo > 0) {
                timeString = `${hoursAgo} hours ago`;
            }
            else if (minutesAgo > 0) {
                timeString = `${minutesAgo} minutes ago`;
            }
            else {
                timeString = 'Just now';
            }

            // Create the question item HTML
            questionElement.innerHTML = `
                <div class="d-flex gap-2 w-100 justify-content-between">
                    <div>
                        <h6 class="mb-0">${questionsData.question}</h6>
                        <p class="mb-0 opacity-75">${questionsData.issue}</p>
                    </div>
                    <small class="opacity-50 text-nowrap">${timeString}</small>
                </div>`;

            // Append the question element to the discussion section
            discussionSection.appendChild(questionElement);
            });
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    }
    fetchQuestions(); // Initial fetch
    // Refresh page after new question is submitted
    document.getElementById('questionToast').addEventListener('hidden.bs.toast', fetchQuestions);
});