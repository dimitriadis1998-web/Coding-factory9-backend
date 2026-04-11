import User, { IUser } from '../models/user.model';

// Mongoose
// Η .lean() είναι μια επιλογή ερωτήματος που επιστρέφει απλά αντικείμενα JavaScript (POJO) αντί για Mongoose Document. Βελτιώνει σημαντικά την απόδοση και μειώνει τη χρήση μνήμης (συχνά έως και 10 φορές πιο γρήγορα) παρακάμπτοντας την παρακολούθηση αλλαγών και την επικύρωση του Mongoose, καθιστώντας την ιδανική για αιτήματα GET μόνο για ανάγνωση.
// Το .exec(): Εκτελεί πραγματικά το query. Χωρίς .exec(), το Mongoose query είναι ένα Query object, όχι Promise. Με .exec() γίνεται πραγματικό Promise.
// Δίνει καλύτερο TypeScript typing: Χωρίς .exec() → Mongoose δίνει περίεργους τύπους (Query<T>), Με .exec() → παίρνεις Promise<T>
// Αποφεύγει silent errors: Χωρίς .exec(), κάποια errors εμφανίζονται αργότερα ή σιωπηλά. Με .exec(), τα errors είναι predictable.

export const findAll = async (): Promise<IUser[]> => {
  return await User.find().populate('roles').lean().exec();
};

export const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id).populate('roles').lean().exec();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email:email }).populate('roles').lean().exec();
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return await user.save();
};

export const updateUser = async (username: string, payload: Partial<IUser>): Promise<IUser | null>  => {
  return await User.findOneAndUpdate({username:username}, payload, { new: true }).populate('roles').lean().exec();
};

export const deleteUser = async (username: string): Promise<boolean> => {
  const result = await User.findOneAndDelete({ username }).exec();
  return !!result;
};
// Το !!result είναι μια διπλή άρνηση που μετατρέπει ΟΠΟΙΑΔΗΠΟΤΕ τιμή σε αυστηρή λογική τιμή:
// !value → μετατρέπει σε λογική τιμή και την αντιστρέφει
// !!value → την αντιστρέφει δύο φορές → το τελικό αποτέλεσμα είναι αληθές ή ψευδές
// Αυτό σημαίνει:
// Εάν η λειτουργία διαγραφής βρήκε και διέγραψε έναν χρήστη → το αποτέλεσμα είναι ένα αντικείμενο → το !!result γίνεται αληθές
// Εάν η λειτουργία διαγραφής δεν βρήκε έναν χρήστη → το αποτέλεσμα είναι null → το !!result γίνεται ψευδές
// Παράδειγμα:
// const result = await User.findByIdAndDelete(id);
// Εάν υπάρχει χρήστης → επιστρέφει το διαγραμμένο αντικείμενο χρήστη → truthy → !!result === true
// Εάν ΔΕΝ υπάρχει χρήστης → επιστρέφει null → falsy → !!result === false