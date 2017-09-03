class ChallengeListMailer < ApplicationMailer
  def challenge_list_email(file_stream)
    return if Rails.env.test?
    attachments['ChallengeList.xlsx'] = {
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      content: file_stream.read
    }
    to = Rails.env.production? ? ENV['CHALLENGE_LIST_RECIPIENTS'].split(',') : ENV['MAINTAINER_EMAIL']
    mail(to: to, subject: 'Challenge List', from: 'osumbit@gmail.com')
  end
end
