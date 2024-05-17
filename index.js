// 캐릭터 불러오기 버튼에 클릭 이벤트 리스너 추가
document.getElementById('fetchCharactersBtn').addEventListener('click', fetchCharacters);

// 아이템 불러오기 버튼에 클릭 이벤트 리스너 추가
document.getElementById('fetchItemsBtn').addEventListener('click', fetchItems);

// 캐릭터 불러오기 함수
async function fetchCharacters() {
    try {
        // 서버로 캐릭터 데이터 요청
        const response = await fetch('/api/characters');
        const characters = await response.json(); // JSON 형태로 변환
        const characterList = document.getElementById('characterList');

        // 이전 목록 지우기
        characterList.innerHTML = '';

        // 받아온 캐릭터 데이터를 리스트로 표시
        characters.forEach(character => {
            const listItem = document.createElement('li');
            listItem.textContent = `${character.name} (ID: ${character.character_id}) - HP: ${character.health}, Power: ${character.power}`;
            characterList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
}

// 아이템 불러오기 함수
async function fetchItems() {
    try {
        // 서버로 아이템 데이터 요청
        const response = await fetch('/api/items');
        const items = await response.json(); // JSON 형태로 변환
        const itemList = document.getElementById('itemList');

        // 이전 목록 지우기
        itemList.innerHTML = '';

        // 받아온 아이템 데이터를 리스트로 표시
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.item_name} (Code: ${item.item_code})`;
            itemList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// 캐릭터 생성 함수
async function createCharacter() {
    const name = prompt('Enter character name:');
    if (name) {
        try {
            // 서버로 캐릭터 생성 요청
            const response = await fetch('/api/characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error creating character:', error);
        }
    }
}

// 아이템 생성 함수
async function createItem() {
    const item_name = prompt('Enter item name:');
    const item_code = parseInt(prompt('Enter item code:'));
    const item_stat = { damage: parseInt(prompt('Enter item damage:')), defense: parseInt(prompt('Enter item defense:')) };
    if (item_name && !isNaN(item_code) && !isNaN(item_stat.damage) && !isNaN(item_stat.defense)) {
        try {
            // 서버로 아이템 생성 요청
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item_name, item_code, item_stat })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error creating item:', error);
        }
    }
}
