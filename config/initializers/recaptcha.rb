Recaptcha.configure do |config|
  config.site_key  = Rails.application.credentials.dig(:recaptcha, :RECAPTCHA_SITE_KEY_V2)
  config.secret_key = Rails.application.credentials.dig(:recaptcha, :RECAPTCHA_SECRET_KEY_V2)
  
  # Uncomment the following line if you are using a proxy server:
  # config.proxy = 'http://myproxy.com.au:8080'
end