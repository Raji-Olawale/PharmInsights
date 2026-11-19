export function exportRespondents(respondents, format = 'excel', filename = 'pharmainsight-responses', questionnaires = []) {
  const questionColumns = buildQuestionColumns(respondents, questionnaires)
  const columns = [
    'Response ID',
    'Submitted at',
    'Category',
    'Anonymous',
    'Name',
    'Business',
    'Job position',
    'Years of experience',
    'Number of employees',
    'Company operating duration (years)',
    'Location',
    'Contact',
    ...questionColumns.flatMap((column) => column.followUp
      ? [column.header, `${column.header} (follow-up)`]
      : [column.header]),
  ]
  const rows = respondents.map((response) => {
    const row = {
      'Response ID': response.id,
      'Submitted at': response.submittedAt || '',
      Category: response.category,
      Anonymous: response.isAnonymous ? 'Yes' : 'No',
      Name: response.isAnonymous ? 'Anonymous' : response.respondentName || '',
      Business: response.isAnonymous ? 'Anonymous' : response.businessName || '',
      'Job position': response.isAnonymous ? 'Anonymous' : response.jobPosition ?? '',
      'Years of experience': response.isAnonymous ? 'Anonymous' : response.yearsExperience ?? '',
      'Number of employees': response.isAnonymous ? 'Anonymous' : response.employeeCount ?? '',
      'Company operating duration (years)': response.isAnonymous ? 'Anonymous' : response.yearsOperating ?? '',
      Location: response.isAnonymous ? 'Anonymous' : response.location || '',
      Contact: response.isAnonymous ? 'Anonymous' : response.contact || '',
    }
    for (const column of questionColumns) {
      const answer = response.answers.find((item) =>
        response.categorySlug === column.categorySlug
          && item.questionNo === column.questionNo
          && item.question === column.question)
      row[column.header] = answer?.answerText || ''
      if (column.followUp) row[`${column.header} (follow-up)`] = answer?.followUpAnswer || ''
    }
    return row
  })
  const content = format === 'csv' ? createCsv(rows, columns) : createExcelXml(rows, columns)
  const extension = format === 'csv' ? 'csv' : 'xls'
  const type = format === 'csv' ? 'text/csv;charset=utf-8' : 'application/vnd.ms-excel;charset=utf-8'
  download(`${filename}.${extension}`, content, type)
}

function buildQuestionColumns(respondents, questionnaires) {
  const definitions = questionnaires.flatMap((questionnaire) => questionnaire.questions.map((question) => ({
    categorySlug: questionnaire.category.slug,
    categoryName: questionnaire.category.name,
    questionNo: question.position,
    question: question.text,
    followUp: Boolean(question.followUp),
  })))
  if (!definitions.length) {
    for (const respondent of respondents) {
      for (const answer of respondent.answers) {
        definitions.push({
          categorySlug: respondent.categorySlug,
          categoryName: respondent.category,
          questionNo: answer.questionNo,
          question: answer.question,
          followUp: Boolean(answer.followUpAnswer),
        })
      }
    }
  }
  const unique = new Map()
  for (const item of definitions) {
    const key = `${item.categorySlug}:${item.questionNo}:${item.question}`
    if (!unique.has(key)) {
      unique.set(key, {
        ...item,
        header: `Q${item.questionNo}: ${item.question} (${item.categoryName})`,
      })
    } else {
      unique.get(key).followUp ||= item.followUp
    }
  }
  return [...unique.values()].sort((first, second) =>
    first.categorySlug.localeCompare(second.categorySlug) || first.questionNo - second.questionNo)
}

function protectCsvFormula(value) {
  const text = String(value ?? '')
  return /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text
}

function createCsv(rows, columns) {
  const escape = (value) => `"${protectCsvFormula(value).replaceAll('"', '""')}"`
  return `\uFEFF${[columns, ...rows.map((row) => columns.map((column) => row[column]))]
    .map((row) => row.map(escape).join(','))
    .join('\r\n')}`
}

function createExcelXml(rows, columns) {
  const escape = (value) => Array.from(String(value ?? ''))
    .filter((character) => {
      const code = character.charCodeAt(0)
      return !((code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31))
    })
    .join('')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
  const xmlRow = (values) => `<Row>${values.map((value) => (
    `<Cell><Data ss:Type="String">${escape(value)}</Data></Cell>`
  )).join('')}</Row>`
  const table = [xmlRow(columns), ...rows.map((row) => xmlRow(columns.map((column) => row[column])))].join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Research responses"><Table>${table}</Table></Worksheet>
</Workbook>`
}

function download(filename, content, type) {
  const file = new Blob([content], { type })
  const url = URL.createObjectURL(file)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
