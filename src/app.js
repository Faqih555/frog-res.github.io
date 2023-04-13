require('dotenv').config()
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const collection = require("./mongodb");
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layouts",
  });
});

app.get("/ebook", (req, res) => {
  res.render("ebook", {
    layout: "layouts/main-layouts",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/main-layouts",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    layout: "layouts/main-layouts",
  });
});

app.post(
  "/register",
  [
    body("name").custom(async (value) => {
      if (value == "") {
        throw new Error("nama tidak boleh kosong");
      }
      return true;
    }),
    body("email").custom(async (value) => {
      if (value == "") {
        throw new Error("email tidak boleh kosong");
      }
      return true;
    }),
    body("password").custom(async (value) => {
      if (value == "") {
        throw new Error("password tidak boleh kosong");
      }
      return true;
    }),
    body("name").custom(async (value) => {
      const duplikat = await collection.findOne({ name: value });
      if (duplikat) {
        throw new Error("nama sudah terdaftar");
      }
      return true;
    }),
    body("email").custom(async (value) => {
      const duplikat = await collection.findOne({ email: value });
      if (duplikat) {
        throw new Error("email sudah terdaftar");
      }
      return true;
    }),
    check("email", "email tidak valid").isEmail(),
    check("password", "password minimal 8 character").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10); // Melakukan hashing password dengan bcryptjs
    const data = {
      name: name,
      email: email,
      password: hashedPassword, // Menggunakan password yang sudah di-hash
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("register", {
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } else {
      await collection.insertMany([data]);

      res.render("login", {
        layout: "layouts/main-layouts",
      });
    }
  }
);

app.post(
  "/login",
  [
    body("name").custom(async (value) => {
      if (value == "") {
        throw new Error("nama tidak boleh kosong");
      }
      return true;
    }),
    body("password").custom(async (value) => {
      if (value == "") {
        throw new Error("password tidak boleh kosong");
      }
      return true;
    }),
    body("name").custom(async (value) => {
      const user = await collection.findOne({ name: value });
      if (!user) {
        throw new Error("nama belum terdaftar");
      }
      return true;
    }),
    body("password").custom(async (value) => {
      const user = await collection.findOne({ password: value });
      if (!user) {
        throw new Error("password anda salah");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const {name, password} = req.body

    const datauser = await collection.findOne({$or: [{name: name}, {email: name}]})
    if(datauser){
      const passwordUser = await bcryptjs.compare(password, datauser.password)
      if(passwordUser){
        const data ={
          id: datauser._id
        }
        const token = await jsonwebtoken.sign(data, process.env.JWS_SECRET)
        return res.render("index", {
          layout: "layouts/main-layouts",
          token: token
        });
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("login", {
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } 
  }
);

app.get("/dart", (req, res) => {
  res.render("dart", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/dart.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/cplusplus", (req, res) => {
  res.render("cplusplus", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/cplusplus.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/csharp", (req, res) => {
  res.render("csharp", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/csharp.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/java", (req, res) => {
  res.render("java", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/java.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/js", (req, res) => {
  res.render("js", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/javascript.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/perl", (req, res) => {
  res.render("perl", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/perl.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/php", (req, res) => {
  res.render("php", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/php.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/python", (req, res) => {
  res.render("python", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/python.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/r", (req, res) => {
  res.render("r", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/r.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/ruby", (req, res) => {
  res.render("ruby", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/ruby.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/swift", (req, res) => {
  res.render("swift", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/swift.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.get("/ts", (req, res) => {
  res.render("ts", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    img: "/logo/typescript.png",
    subMenuDasar1: "Flex",
    subMenuDasar2: "Margin",
    subMenuDasar3: "lol",
    subMenuMahir1: "lol",
    subMenuMahir2: "Grid",
    subMenuMahir3: "Padding",
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1> 404 <h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
