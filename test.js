let p = i => new Promise((resolve, reject) => {
  let time = Math.random() * 1000;
  setTimeout(resolve, time, i);
});

let func = async () => {
  for (let i = 0; i < 6; i++) {
    let res = await p(i);
    console.log(res);
  }
};

func();
