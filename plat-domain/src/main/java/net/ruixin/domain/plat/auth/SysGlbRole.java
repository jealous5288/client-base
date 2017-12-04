package net.ruixin.domain.plat.auth;

import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.enumerate.plat.Sfqy_st;
import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;

import javax.persistence.*;

/**
 * Created by admin on 2016-8-24.
 * 角色关联要素实体
 */
@SuppressWarnings("unused")
@Table(name = "SYS_GLB_ROLE")
@Entity
@DynamicInsert
@DynamicUpdate
public class SysGlbRole extends BaseDomain {

    //ID
    @Id
    @SequenceGenerator(name = "seq_sysglbrole", sequenceName = "SEQ_SYS_GLB_ROLE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sysglbrole")
    private Long id;

    //角色ID
    @Column(name = "ROLE_ID")
    private Long roleId;

    //角色名称
    @Formula("(SELECT ROLE.ROLE_NAME FROM SYS_ROLE ROLE WHERE ROLE.ID = ROLE_ID AND ROLE.SFYX_ST = '1')")
    private String role_name;
    //角色代码
    @Formula("(SELECT ROLE.ROLE_CODE FROM SYS_ROLE ROLE WHERE ROLE.ID = ROLE_ID AND ROLE.SFYX_ST = '1')")
    private String role_code;
    //角色类型
    @Formula("(SELECT ROLE.ROLE_TYPE FROM SYS_ROLE ROLE WHERE ROLE.ID = ROLE_ID AND ROLE.SFYX_ST = '1')")
    private String role_type;

    @Formula("(SELECT SS.VALUE FROM SYS_ROLE R, SYS_SUBDICT SS WHERE R.ROLE_TYPE = SS.CODE " +
            "   AND SS.DICT_CODE = 'JSLX' AND R.ID = ROLE_ID " +
            "   AND SS.SFYX_ST = '1' AND R.SFYX_ST = '1' )")
    private String role_type_name;

    //角色关联ID
    @Column(name = "GL_ID")
    private Long glId;

    //关联类型，3：用户，1：岗位，2：组织
    @Column(name = "GL_TYPE")
    private String glType;

    //关联要素名称
    @Formula("(CASE GL_TYPE WHEN '1' THEN (SELECT P.POST_NAME FROM SYS_POST P WHERE P.ID=GL_ID AND P.SFYX_ST='1')\n" +
            "  WHEN '2' THEN (SELECT O.ORGAN_NAME FROM SYS_ORGAN O WHERE O.ID=GL_ID AND O.SFYX_ST='1')\n" +
            "  WHEN '3' THEN (SELECT U.USER_NAME FROM SYS_USER U WHERE U.ID=GL_ID AND U.SFYX_ST='1') ELSE '' END)")
    private String glysName;

    //关联要素所属机构名称
    @Formula("(CASE GL_TYPE WHEN '1' THEN (\n" +
            "  SELECT O.ORGAN_NAME FROM SYS_ORGAN O,SYS_POST P WHERE P.ORGAN=O.ID AND P.ID=GL_ID AND P.SFYX_ST='1' AND O.SFYX_ST='1')\n" +
            " WHEN '2' THEN (\n" +
            "  SELECT SO.ORGAN_NAME FROM SYS_ORGAN SO WHERE SO.ID=(SELECT O.PARENT_ORG FROM SYS_ORGAN O WHERE O.ID=GL_ID AND O.SFYX_ST='1'))\n" +
            " WHEN '3' THEN (\n" +
            "  SELECT O.ORGAN_NAME FROM SYS_ORGAN O,SYS_USER U WHERE U.DEFAULT_ORGAN_ID=O.ID AND U.ID=GL_ID AND U.SFYX_ST='1' AND O.SFYX_ST='1') \n" +
            " ELSE '' END)")
    private String glysSsjg;

    //是否有效  0：无效   1：有效
    @Enumerated
    private Sfyx_st sfyx_st;

    //是否启用  0：否   1：是
    @Enumerated
    private Sfqy_st sfqy_st;

    //恢复状态  0：已恢复，1：可恢复
    @Column(name = "HF_ST")
    private String hf_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getGlId() {
        return glId;
    }

    public void setGlId(Long glId) {
        this.glId = glId;
    }

    public String getGlType() {
        return glType;
    }

    public void setGlType(String glType) {
        this.glType = glType;
    }

    public String getGlysName() {
        return glysName;
    }

    public void setGlysName(String glysName) {
        this.glysName = glysName;
    }

    public String getGlysSsjg() {
        return glysSsjg;
    }

    public void setGlysSsjg(String glysSsjg) {
        this.glysSsjg = glysSsjg;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }

    public Sfqy_st getSfqy_st() {
        return sfqy_st;
    }

    public void setSfqy_st(Sfqy_st sfqy_st) {
        this.sfqy_st = sfqy_st;
    }

    public String getRole_name() {
        return role_name;
    }

    public void setRole_name(String role_name) {
        this.role_name = role_name;
    }

    public String getRole_code() {
        return role_code;
    }

    public void setRole_code(String role_code) {
        this.role_code = role_code;
    }

    public String getRole_type() {
        return role_type;
    }

    public void setRole_type(String role_type) {
        this.role_type = role_type;
    }

    public String getRole_type_name() {
        return role_type_name;
    }

    public void setRole_type_name(String role_type_name) {
        this.role_type_name = role_type_name;
    }

    public String getHf_st() {
        return hf_st;
    }

    public void setHf_st(String hf_st) {
        this.hf_st = hf_st;
    }
}
