Recaptcha.configure do |config|
  config.site_key  = Rails.application.secrets.reCaptcha_key_v2
  config.secret_key = Rails.application.secrets.reCaptcha_secret_v2
  # Uncomment the following line if you are using a proxy server:
  # config.proxy = 'http://myproxy.com.au:8080'
end