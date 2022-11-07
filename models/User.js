import mongoose from 'mongoose';

//все данные которые нужны обязатель образуем при помощи объекта как fullName, если иначе то просто прописываем без объекта как
// avatarUrl

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  avatarUrl: String,
}, {
  timestamps: true //это для чтоб серевер прикручивал дату создания или обновления
});

export default mongoose.model('User', UserSchema)