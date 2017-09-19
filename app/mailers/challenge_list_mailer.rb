class ChallengeListMailer < ApplicationMailer
  def challenge_list_email(file_stream)
    return if Rails.env.test?
    attachments['ChallengeList.xlsx'] = {
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      content: file_stream.read
    }
    # This env variable should be a comma separated list of email addresses
    to = ENV['CHALLENGE_LIST_RECIPIENTS'].split(',')
    mail(to: to, subject: 'Challenge List', from: 'osumbit@gmail.com')
  end
end
