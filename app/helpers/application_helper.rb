module ApplicationHelper
  def update_alert_log
    session[:alert_log] = @alert_log
  end
end
