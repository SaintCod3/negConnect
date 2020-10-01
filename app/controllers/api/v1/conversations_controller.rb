class Api::V1::ConversationsController < Api::V1::BaseController
    before_action :authorized
    def index
        @conversation_all = Conversation.where("request_id": params[:request_id])
        @conversation_user = Conversation.where("request_id": params[:request_id], "user_id": params[:user_id])
        @request = Request.where("id": params[:request_id])
        if requestor 
          render json: {conversations: @conversation_all.as_json({except: [ :created_at, :updated_at],
          :include => [user: {except: [:id, :password_digest, :email, :created_at, :updated_at]}],
          }), request: @request.as_json({except: [ :created_at, :updated_at],
          :include => [user: {except: [:id, :password_digest, :email, :created_at, :updated_at]}, volunteers: {only: [:id,:user_id]}, request_type: {only: [:name]}, status: {only: [:name]}],
          })}
        elsif verified_user 
          render json: {conversations: @conversation_user.as_json({except: [ :created_at, :updated_at],
          :include => [user: {except: [ :password_digest, :email, :created_at, :updated_at]}]
          }), request: @request.as_json({except: [ :created_at, :updated_at],
          :include => [user: {except: [ :password_digest, :email, :created_at, :updated_at]}]
          })}
        else
        render json: { "error":"You are not part of this conversation" }, status: 401
      end
      
  end

  def create
    if verified_user 
      @conversation = Conversation.where(user_id: params[:user_id], request_id: params[:request_id])
       render json: {error: @conversation.as_json({except: [ :created_at, :updated_at]})}
    else
    @conversation = Conversation.create(conversation_params)
    respond_with :api, :v1, @conversation, location: -> { api_v1_request_conversations_url(@conversation) }
    end
  end

  def show 
    @request = Request.where("id": params[:request_id])
    @conversation = Message.where("conversation_id": params[:id])
    if requestor or verified_user
      render json: {messages: @conversation.as_json({except: [:id, :updated_at],
      :include => [user: {except: [:id, :password_digest, :email, :created_at, :updated_at]}]
      }), request: @request}
    else
      render json: { "error":"You are not part of this conversation" }, status: 401  
    end
  end

  def destroy
    respond_with Chat.destroy(params[:id])
  end

  private

  def verified_user 
    Conversation.where(user_id: params[:user_id], request_id:
    params[:request_id]).exists? 
  end

  def verified_volunteer
    Volunteer.where(user_id: params[:user_id], request_id:
    params[:request_id]).exists?
  end

  def requestor
    Request.where(user_id: params[:user_id], id:
    params[:request_id]).exists?
  end

  def conversation_params
    params.require(:conversation).permit(:id, :user_id, :request_id)
  end
end
