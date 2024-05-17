// 필요한 모듈을 불러옵니다.
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// 요청의 body를 파싱하기 위해 미들웨어를 설정합니다.
app.use(express.json());

// MongoDB와 연결합니다. <password> 부분을 실제 비밀번호로 바꿉니다. 비밀번호에 특수문자가 포함된 경우 URL 인코딩을 해야 합니다.
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB에 연결되었습니다.'))
  .catch(error => console.error('MongoDB 연결 오류:', error));

// 스키마 및 모델 정의
const characterSchema = new mongoose.Schema({
  character_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  health: { type: Number, default: 500 },
  power: { type: Number, default: 100 }
});

const itemSchema = new mongoose.Schema({
  item_code: { type: Number, required: true, unique: true },
  item_name: { type: String, required: true },
  item_stat: { type: Object, required: true }
});

const Character = mongoose.model('Character', characterSchema);
const Item = mongoose.model('Item', itemSchema);

// 기본 라우트를 설정합니다.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // HTML 파일을 보냅니다.
});

// 캐릭터 생성 API를 정의합니다.
app.post('/api/characters', async (req, res) => {
  try {
    const { name } = req.body;

    // 이미 존재하는 캐릭터 이름인지 확인합니다.
    const existingCharacter = await Character.findOne({ name });
    if (existingCharacter) {
      return res.status(400).json({ error: '이미 존재하는 캐릭터 이름입니다.' });
    }

    // 캐릭터 ID를 순차적으로 부여합니다.
    const lastCharacter = await Character.findOne().sort({ character_id: -1 });
    const character_id = lastCharacter ? lastCharacter.character_id + 1 : 1;

    // 캐릭터를 생성하고 데이터베이스에 저장합니다.
    const character = new Character({ character_id, name });
    await character.save();

    // 성공 응답을 전송합니다.
    res.status(201).json({ message: '캐릭터가 생성되었습니다.', character });
  } catch (error) {
    // 에러 응답을 전송합니다.
    res.status(500).json({ error: error.message });
  }
});

// 캐릭터 삭제 API를 정의합니다.
app.delete('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findOneAndDelete({ character_id: id });
    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 캐릭터 상세 조회 API를 정의합니다.
app.get('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Character.findOne({ character_id: id });
    if (!character) {
      return res.status(404).json({ error: '캐릭터를 찾을 수 없습니다.' });
    }
    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 아이템 생성 API를 정의합니다.
app.post('/api/items', async (req, res) => {
  try {
    const { item_code, item_name, item_stat } = req.body;
    const item = new Item({ item_code, item_name, item_stat });
    await item.save();
    res.status(201).json({ message: '아이템이 생성되었습니다.', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 아이템 수정 API를 정의합니다.
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, item_stat } = req.body;
    const item = await Item.findByIdAndUpdate(id, { item_name, item_stat }, { new: true });
    if (!item) {
      return res.status(404).json({ error: '아이템을 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '아이템이 수정되었습니다.', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 아이템 목록 조회 API를 정의합니다.
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find({}, { item_code: 1, item_name: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 아이템 상세 조회 API를 정의합니다.
app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: '아이템을 찾을 수 없습니다.' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 서버를 시작합니다.
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
