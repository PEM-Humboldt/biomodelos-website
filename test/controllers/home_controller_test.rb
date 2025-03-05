require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
    assert_response :success
  end

  test "should get contact_us" do
    get home_contact_us_path
    assert_response :success
    
  end

  test "should get publish" do
    get home_publish_path
    assert_response :success
  end

  test "should get terms" do
    get home_terms_path
    assert_response :success
  end

  test "should get about_us" do
    get home_about_us_path
    assert_response :success
  end
end
