package com.makeit.api.model;

import com.makeit.dao.model.Profile;
import com.makeit.dao.model.User;
import io.swagger.annotations.ApiModel;
import lombok.*;

/**
 * @author sonnyako <Makydon Sofiia>
 * @version 1.0.0
 * @since 1.0.0
 */
@Data
@ApiModel
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CompanyDto {

    private Long id;
    private String name;
    private String description;
    private String logo;
    private UserDto owner;
}
