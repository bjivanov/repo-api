
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  password: String,
  salt: String,
});

UserSchema.methods.validatePassword = function(password) {
  const passwordHash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.password === passwordHash;
};

UserSchema.pre('save', function(next) {
  if (this.password) {
      this.salt = crypto.randomBytes(16).toString('hex');
      this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 512, 'sha512').toString('hex');
  };
  next();
});

mongoose.model('User', UserSchema);