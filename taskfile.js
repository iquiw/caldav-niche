module.exports = {
  *test(task) {
    return task
      .source('test/*.js')
      .ava();
  }
};
