package com.smartagriculture.service;

import com.smartagriculture.dto.UserResponse;
import com.smartagriculture.entity.User;

public interface UserService {

    UserResponse getCurrentUserProfile();

    User getCurrentUserEntity();
}
