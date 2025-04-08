export const BASE_URL = "http://127.0.0.1:8000";

export const getUserInfo = async (email) => {
  return new Promise((resolve) => {
    fetch(`${BASE_URL}/user/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        resolve(null)
      });
  })
}