package net.ruixin.domain.plat.message;

import net.ruixin.enumerate.plat.Sfyx_st;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

@SuppressWarnings("unused")
@Table(name = "SYS_MESSAGE")
@Entity
@DynamicInsert
@DynamicUpdate
public class Message {

    @Id
    @SequenceGenerator(name = "seq_sys_message_type", sequenceName = "SEQ_SYS_MESSAGE_TYPE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_sys_message_type")
    private Long id;

    //标题
    @Column(name = "TITLE")
    private String title;

    //内容
    @Column(name = "CONTENT")
    private String content;
    //来源
    @Column(name = "SOURCE")
    private Long source;

    //类型编码
    @Column(name = "TYPE_CODE")
    private String typeCode;

    //跳转参数
    @Column(name = "PARAM")
    private String param;

    //是否有效
    @Enumerated
    private Sfyx_st sfyx_st;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getSource() {
        return source;
    }

    public void setSource(Long source) {
        this.source = source;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getParam() {
        return param;
    }

    public void setParam(String param) {
        this.param = param;
    }

    public Sfyx_st getSfyx_st() {
        return sfyx_st;
    }

    public void setSfyx_st(Sfyx_st sfyx_st) {
        this.sfyx_st = sfyx_st;
    }


    //有参构造器
    public Message(String typeCode, String title, String content, Long source, String param) {
        this.typeCode = typeCode;
        this.title = title;
        this.content = content;
        this.source = source;
        this.param = param;
        this.sfyx_st = Sfyx_st.VALID;
    }

    //无参构造器
    public Message() {
    }
}
