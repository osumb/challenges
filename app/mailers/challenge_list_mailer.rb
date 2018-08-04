class ChallengeListMailer < ApplicationMailer
  def challenge_list_email(file_stream)
    attachments["ChallengeList.xlsx"] = {
      mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      content: file_stream.read
    }
    to = ENV["CHALLENGE_LIST_RECIPIENTS"].split(",")
    mail(to: to, subject: "Challenge List", from: "osumbit@gmail.com")
  end
end
