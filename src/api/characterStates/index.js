export async function getCharacterStates() {
  return fetch('http://localhost:3001/characterStates')
  // fetch('/characterStates')
    .then((result) => {
      if (!result.ok) throw new Error(result);
      return result.json();
    });
}
