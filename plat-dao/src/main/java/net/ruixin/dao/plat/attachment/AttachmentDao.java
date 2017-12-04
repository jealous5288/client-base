package net.ruixin.dao.plat.attachment;

import net.ruixin.domain.plat.attachment.Attachment;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 附件Dao层
 */
@Repository
public class AttachmentDao extends BaseDao<Attachment> implements IAttachmentDao {

    @Override
    public Long saveAttachment(Attachment attachment) {
        super.saveOrUpdate(attachment);
        return attachment.getId();
    }

    @Override
    public Attachment getAttachmentById(Long id) {
        return super.get(id);
    }

    @Override
    public void delAttachment(String idstr) {
        super.deleteBatch(idstr);
    }

    @Override
    public List<Attachment> getAttachmentList(Map map) {
        StringBuilder hql = new StringBuilder("from Attachment A where A.sfyx_st='1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("uuid"))) {
            hql.append(" and A.uuid=? ");
            args.add(map.get("uuid"));
        }
        if (RxStringUtils.isNotEmpty(map.get("fjlbNo"))) {
            hql.append(" and A.fjlbNo=? ");
            args.add(map.get("fjlbNo"));
        }
        return super.findListByHql(hql, args.toArray());
    }

    @Override
    public List<Attachment> getAttachmentList(String uuid) {
        String hql = "from Attachment A where A.sfyx_st='1' and A.uuid=? ";
        return super.findListByHql(hql, uuid);
    }

    @Override
    public void updateThPath(Long id, String thPath) {
        String usql = "UPDATE SYS_ATTACHMENT SET TH_ABSOLUTEPATH=? WHERE ID=? AND SFYX_ST='1' ";
        super.executeSqlUpdate(usql, thPath, id);
    }

    @Override
    public void updateGpy(String ids) {
        String sql = "UPDATE SYS_ATTACHMENT SET SFYX_ST='1' WHERE " + RxStringUtils.getInSql("ID", ids);
        super.executeSqlUpdate(sql);
    }

    @Override
    public void clearOtherImage(String uuid) {
        String sql = "UPDATE SYS_ATTACHMENT SET SFYX_ST = '0' WHERE UUID = ?";
        super.executeSqlUpdate(sql, uuid);
    }
}
