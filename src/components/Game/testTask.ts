function testTask(task: string[], connected: string[][]): boolean {
  const arrForTest = connected.filter((group) => group.length > 2);
  if (!arrForTest.length) return false;
  for (let i = 0; i < arrForTest.length; i += 1) {
    if (arrForTest[i].includes(task[0]) && arrForTest[i].includes(task[1])) {
      return true;
    }
  }
  return false;
}

export default testTask;
