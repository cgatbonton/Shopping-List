const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');
// const buttons = document.querySelectorAll('[class="button"]');

// Array to hold our state

let items = [];

function handleSubmit(e) {
  e.preventDefault();
  const name = e.currentTarget.item.value;
  // or if(!name) return;
  if (name !== '') {
    const item = {
      name: name,
      id: Date.now(),
      complete: false,
    };

    // Push the items into our state
    items.push(item);
    e.target.reset();
    // fire off a custom event that will tell anyone else that the items have been updated
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function displayItems() {
  const html = items
    .map(
      (item) => `<li class="shopping-item">
<input type="checkbox" 
value="${item.id}"
${item.complete ? 'checked' : ''}
>
<span class="itemName">${item.name}</span>
<button 
aria-label="Remove ${item.name}"
value="${item.id}"
>&times;</button>
  </li>`
    )
    .join('');
  list.innerHTML = html;
}

function mirrorToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(items));
  console.info('Saving items to local storage');
}

function restoreFromLocalStorage() {
  console.info('Restoring from LS');
  // pull the items from LS
  const lsItems = JSON.parse(localStorage.getItem('items'));
  if (lsItems.length) {
    // lsItems.forEach((item) => items.push(item));
    items.push(...lsItems);
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
  }
}

function deleteItem(id) {
  // const newItems = items.filter((item) => item.id === id);
  // console.log('newItems', newItems);
  items = items.filter((item) => item.id !== id);
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
  const itemRef = items.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
list.addEventListener('click', function (e) {
  if (e.target.matches('button')) {
    deleteItem(parseInt(e.target.value));
  }
  if (e.target.matches('input[type="checkbox"]')) {
    markAsComplete(parseInt(e.target.value));
  }
});
restoreFromLocalStorage();

const numbers = [1, 2];
const numbersCopy = numbers;
// const numbersCopy = numbers.map((x) => x);
numbersCopy.push(4);
// numbersCopy[0].push(4);
console.log(numbers, numbersCopy);

// list.addEventListener('itemsUpdated', (e) => {
//   console.log(e);
// });
