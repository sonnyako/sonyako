import * as React from "react";
import { WrappedComponentProps, injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { resolve } from "inversify-react";
import { observer } from "mobx-react";

import Time from "react-time";
import { Card, Avatar, Space, Typography, Divider, Tag, Dropdown, Menu } from 'antd';

import { CurrencyType, TopProjectDto, TopDeveloperDto } from '@client/api-client';
import { HomeModel } from "@page/home";
import { toJS } from 'mobx';

@observer
class IncomingProject extends React.Component<WrappedComponentProps & { project?: TopProjectDto }> {

    @resolve
    private model: HomeModel;

    public render() {
        const { project } = this.props;

        const matches = project.description.match(/<[p][^>]*>(.+?)<\/[p]>/gm);
        const description = matches.length > 1
            ? [matches[1], matches[2] || ""].join("<div style='clear: both'></div>")
            : project.description;

        return (
            <>
                <Card className="incoming-project"
                    actions={this.renderProjectAction(project)}>
                    <Space direction="horizontal" align="start" size={20} className="incoming-project-overview">
                        <div>
                            <Avatar
                                size={120}
                                shape="square"
                                src={project.logo}
                                style={{border: "1px solid #d9d9d9", borderRadius: 3, padding: 6}} />
                            <div className="incoming-project-overview-budjet">
                                <span>{`${project.ratePerHour}${this.getCurrencySign(project.rateCurrency)}/hr`}</span>
                                <br />
                                <kbd>{`${project.proposals} persons`}</kbd>
                                <br />
                                <kbd>{`${project.minDuration}-${project.maxDuration} months`}</kbd>
                            </div>
                        </div>
                        <Space direction="vertical" size={0}>
                            <Typography.Paragraph>
                                <h4>{project.name}</h4>
                            </Typography.Paragraph>
                            <br />
                            <Typography.Paragraph type="secondary">
                                Since: <Time value={project.createdAt} format="YY, MMM, DD" />, Located: <span>{project.address.city}, {project.address.countryCode}</span>
                            </Typography.Paragraph>
                            <Divider plain />
                            <div className="incoming-project-tags">
                                <Tag color="#f0f0f0">Java</Tag>
                                <Tag color="#f0f0f0">TypeScript</Tag>
                                <Tag color="#f0f0f0">Kafka Streams</Tag>
                                <Tag color="#f0f0f0">DataDog</Tag>
                            </div>
                        </Space>
                    </Space>
                    <Divider plain />
                    <Typography.Paragraph ellipsis={{ rows: 5, expandable: false }} >
                        <span
                            style={{display: "block", height: 83, overflow: "hidden"}}
                            dangerouslySetInnerHTML={{ __html: description.replace("<p></p>", "") }} />
                    </Typography.Paragraph>
                </Card>
            </>
        );
    }

    private renderProjectAction(project: TopProjectDto) {
        return [
            <this.hireMenu key="hire-me-action" project={project} />,
            <span key="contact-owner" onClick={() => this.openContactDrawer(project)}>Contact Owner</span>,
            <span key="view-project"><Link to={`/project/view/${project.id}`}>View Project</Link></span>
        ]
    }

    private openContactDrawer(project: TopProjectDto) {
        this.model.activeProject = project;
        this.model.isCommentDrawerOpen = true;
    }

    private getCurrencySign(currency: string): string {
        switch (currency as CurrencyType) {
            // @formatter:off
            case CurrencyType.EUR: return "€";
            case CurrencyType.GBP: return "£";
            case CurrencyType.UAH: return "₴";
            case CurrencyType.USD: return "$";
            // @formatter:on
        }
    }

    private hireMenu = (props: { project?: TopProjectDto, freelancer?: TopDeveloperDto }) => {
        const [menu, setMenu] = React.useState([]);
        const [real, setReal] = React.useState(true);
        React.useEffect(() => {
            const getMenu = async () => {
                const projects = await this.model.getUserProjects(props.project, props.freelancer);
                if (projects.length === 1 && projects[0].id <= 0) {
                    setReal(false);
                }
                setMenu(projects);
            };
            getMenu();
        }, [props.project, props.freelancer]);

        return (
            <Dropdown overlayClassName="hire-me-dropdown" trigger={["click"]} overlay={<Menu>
                {
                    !real ? null : <>
                        <li>
                            <strong>
                            {
                                !!props.project ? "Confirm project before send" : "Select Your Projects"
                            }
                            </strong>
                        </li>
                        <Divider plain/>
                    </>
                }
                {
                    menu.map((value) => (
                        <Menu.Item prefix="ant-dropdown-menu" disabled={value.id === 0} key={`menu-${value.id}`}>
                            <span onClick={()=>this.handleHire(value, props.project, props.freelancer)}>{value.name}</span>
                        </Menu.Item>
                    ))
                }
            </Menu>}><a>Hire Me</a></Dropdown>
        )
    }

    private async handleHire(value, project, freelancer) {
        if (!value || value.id === 0) {
            return;
        }

        if (value && freelancer) {
            await this.model.hireFreelancer(freelancer.id, value.id);
        }

        if (value && project) {
            await this.model.hireFreelancer(value.id, project.id);
        }
    }
}

export default injectIntl(IncomingProject);
