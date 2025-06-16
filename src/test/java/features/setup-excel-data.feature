Feature: Setup Excel Data - Thêm dữ liệu mẫu vào file Excel

  Scenario: Thêm dữ liệu mẫu vào data.xlsx
    * def addSampleDataToExcel = read('classpath:utils/add-sample-data.js')
    * def result = addSampleDataToExcel()
    * print 'Kết quả setup data:', result
    * if (result) karate.log('✅ Đã setup dữ liệu thành công!')
    * if (!result) karate.log('❌ Lỗi khi setup dữ liệu!') 