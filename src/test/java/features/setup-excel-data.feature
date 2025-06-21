Feature: Setup Excel Data - Thêm dữ liệu mẫu vào file Excel

  Scenario: Thêm dữ liệu mẫu vào data.xlsx
    * def addSampleDataToExcel = read('classpath:utils/add-sample-data.js')
    * def result = addSampleDataToExcel()
    * print 'Kết quả setup data:', result
    * if (result) karate.log('✅ Đã setup dữ liệu thành công!')
    * if (!result) karate.log('❌ Lỗi khi setup dữ liệu!')

  @changePassword
  Scenario: Setup Change Password Test Data
    * def addChangePasswordData = read('classpath:utils/add-change-password-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addChangePasswordData(excelFilePath, 'changePassword')
    * if (setupSuccess) karate.log('✅ Setup change password test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup change password test data!') 

  @logout
  Scenario: Setup Logout Test Data
    * def addLogoutData = read('classpath:utils/add-logout-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addLogoutData(excelFilePath, 'logout')
    * if (setupSuccess) karate.log('✅ Setup logout test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup logout test data!')

  @getFollowing
  Scenario: Setup Get Following Test Data
    * def addGetFollowingData = read('classpath:utils/add-get-following-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addGetFollowingData(excelFilePath, 'getFollowing')
    * if (setupSuccess) karate.log('✅ Setup get following test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup get following test data!')

  @getFollowers
  Scenario: Setup Get Followers Test Data
    * def addGetFollowersData = read('classpath:utils/add-get-followers-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addGetFollowersData(excelFilePath, 'getFollowers')
    * if (setupSuccess) karate.log('✅ Setup get followers test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup get followers test data!')

  @follows
  Scenario: Setup Follows Test Data
    * def addFollowsData = read('classpath:utils/add-follows-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addFollowsData(excelFilePath, 'follows')
    * if (setupSuccess) karate.log('✅ Setup follows test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup follows test data!')

  @unfollow
  Scenario: Setup Unfollow Test Data
    * def addUnfollowData = read('classpath:utils/add-unfollow-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addUnfollowData(excelFilePath, 'unfollow')
    * if (setupSuccess) karate.log('✅ Setup unfollow test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup unfollow test data!')

  @like
  Scenario: Setup Like Test Data
    * def addLikeData = read('classpath:utils/add-like-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addLikeData(excelFilePath, 'like')
    * if (setupSuccess) karate.log('✅ Setup like test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup like test data!')

  @unlike
  Scenario: Setup Unlike Test Data
    * def addUnlikeData = read('classpath:utils/add-unlike-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addUnlikeData(excelFilePath, 'unlike')
    * if (setupSuccess) karate.log('✅ Setup unlike test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup unlike test data!')

  @getPostsFeed
  Scenario: Setup GetPostsFeed Test Data
    * def addGetPostsFeedData = read('classpath:utils/add-get-posts-feed-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addGetPostsFeedData(excelFilePath, 'getPostsFeed')
    * if (setupSuccess) karate.log('✅ Setup getPostsFeed test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup getPostsFeed test data!')

  @getUsers
  Scenario: Setup GetUsers Test Data
    * def addGetUsersData = read('classpath:utils/add-get-users-data.js')
    * def excelFilePath = 'src/test/java/data/data.xlsx'
    * def setupSuccess = addGetUsersData(excelFilePath, 'getUsers')
    * if (setupSuccess) karate.log('✅ Setup getUsers test data thành công!')
    * if (!setupSuccess) karate.log('❌ Lỗi khi setup getUsers test data!') 