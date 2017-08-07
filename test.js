function a () {
  throw new Error('error in a');
};
function b () {
  a();
};
function c () {
  b();
};

try {
  c();
} catch (err) {
  console.log(err.message);
}
