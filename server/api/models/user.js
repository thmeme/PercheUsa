import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import token from '../token.js';

const hashCode = (s) => s.split("").reduce((a, b) => {
  a = ((a << 5) - a) + b.charCodeAt(0);
  a & a;
}, 0);

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  studentsphonenumber: {
    type: String,
    min: 10,
    max:10
  },
  birthday: Date,
  sex: {
    type: String
  },
  street: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    validate: [function(email) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  legalguardiansfirstname: {
    type: String
  },
  legalguardianslastname: {
    type: String
  },
  legalguardiansphonenumber: {
    type: String,
  },
  legalguardiansemail: {
    type: String,
    validate: [function(email) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    }, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  accomodation: {
    type: String
  },
  tosmoke: {
    type: String
  },
  tosmokehome: {
    type: String
  },
  health: {
    type: Boolean,
    default: false
  },
  healthdetail: {
    type: String
  },
  diet: {
    type: Boolean,
    default: false
  },
  dietdetail: {
    type: String
  },
  easygoing: {
    type: Boolean,
    default: false
  },
  outgoing: {
    type: Boolean,
    default: false
  },
  quietreserved: {
    type: Boolean,
    default: false
  },
  casual: {
    type: Boolean,
    default: false
  },
  rash: {
    type: Boolean,
    default: false
  },
  withdrawn: {
    type: Boolean,
    default: false
  },
  cheerful: {
    type: Boolean,
    default: false
  },
  hardworking: {
    type: Boolean,
    default: false
  },
  sensitive: {
    type: Boolean,
    default: false
  },
  relaxed: {
    type: Boolean,
    default: false
  },
  ambitius: {
    type: Boolean,
    default: false
  },
  nervous: {
    type: Boolean,
    default: false
  },
  serious: {
    type: Boolean,
    default: false
  },
  musical: {
    type: Boolean,
    default: false
  },
  artistic: {
    type: Boolean,
    default: false
  },
  flexible: {
    type: Boolean,
    default: false
  },
  talkative: {
    type: Boolean,
    default: false
  },
  determined: {
    type: Boolean,
    default: false
  },
  athletic: {
    type: Boolean,
    default: false
  },
  absentminded: {
    type: Boolean,
    default: false
  },
  tolerant: {
    type: Boolean,
    default: false
  },
  stubborn: {
    type: Boolean,
    default: false
  },
  energetic: {
    type: Boolean,
    default: false
  },
  wellorganized: {
    type: Boolean,
    default: false
  },
  whyexchange: {
    type: String
  },
  studentsdescription: {
    type: String
  },
  friendsdescription: {
    type: String
  },
  future: {
    type: String
  },
  familydescription: {
    type: String
  },
  familycomposition: {
    type: String
  },
  transport: {
    type: String
  },
  pets: {
    type: String
  },
  accomodationcapacity: {
    type: String
  },
  notreceive: {
    type: String,
  }
});

userSchema.methods.comparePassword = function(pwd, cb) {
  bcrypt.compare(pwd, this.password, function(err, isMatch) {
    if (err) cb(err);
    cb(null, isMatch);
  });
};

let model = mongoose.model('User', userSchema);

export default class User {

  connect(req, res) {
    if (!req.body.email) {
      res.status(400).send('Please enter an email');
    } else if (!req.body.password) {
      res.status(400).send('Please enter a password');
    } else {
      model.findOne({
        email: req.body.email
      }, (err, user) => {
        if (err || !user) {
          res.sendStatus(403);
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) {
              res.status(400).send(err);
            } else {
              if (isMatch) {
                user.password = null;
                let tk = jsonwebtoken.sign(user, token, {
                  expiresIn: "24h"
                });
                res.json({
                  success: true,
                  user: user,
                  token: tk
                });
              } else {
                res.status(400).send('Incorrect password');
              }
            }
          });
        }
      });
    }
  }

  findAll(req, res) {
    model.find({}, {
      password: 0
    }, (err, users) => {
      if (err || !users) {
        res.sendStatus(403);
      } else {
        res.json(users);
      }
    });
  }

  findById(req, res) {
    model.findById(req.params.id, {
      password: 0
    }, (err, user) => {
      if (err || !user) {
        res.sendStatus(403);
      } else {
        res.json(user);
      }
    });
  }

  create(req, res) {
    if (req.body.password) {
      var salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    model.create(req.body,
      (err, user) => {
        if (err || !user) {
          if (err.code === 11000 || err.code === 11001) {
            err.message = "Email " + req.body.email + " already exist";
          }
          res.status(500).send(err.message);
        } else {
          let tk = jsonwebtoken.sign(user, token, {
            expiresIn: "24h"
          });
          res.json({
            success: true,
            user: user,
            token: tk
          });
        }
      });
  }

  update(req, res) {
    if (req.body.password) {
      var salt = bcrypt.genSaltSync(10);
      req.body.password = bcrypt.hashSync(req.body.password, salt);
    }
    model.update({
      _id: req.params.id
    }, req.body, (err, user) => {
      if (err || !user) {
        res.status(500).send(err.message);
      } else {
        let tk = jsonwebtoken.sign(user, token, {
          expiresIn: "24h"
        });
        res.json({
          success: true,
          user: user,
          token: tk
        });
      }
    });
  }

  delete(req, res) {
    model.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.sendStatus(200);
      }
    });
  }
}
